package com.qcmmanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qcmmanager.IntegrationTest;
import com.qcmmanager.domain.Qcm;
import com.qcmmanager.repository.QcmRepository;
import com.qcmmanager.service.dto.QcmDTO;
import com.qcmmanager.service.mapper.QcmMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link QcmResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class QcmResourceIT {

    private static final byte[] DEFAULT_SUBJECT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SUBJECT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SUBJECT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SUBJECT_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/qcms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QcmRepository qcmRepository;

    @Autowired
    private QcmMapper qcmMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQcmMockMvc;

    private Qcm qcm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Qcm createEntity(EntityManager em) {
        Qcm qcm = new Qcm().subject(DEFAULT_SUBJECT).subjectContentType(DEFAULT_SUBJECT_CONTENT_TYPE);
        return qcm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Qcm createUpdatedEntity(EntityManager em) {
        Qcm qcm = new Qcm().subject(UPDATED_SUBJECT).subjectContentType(UPDATED_SUBJECT_CONTENT_TYPE);
        return qcm;
    }

    @BeforeEach
    public void initTest() {
        qcm = createEntity(em);
    }

    @Test
    @Transactional
    void createQcm() throws Exception {
        int databaseSizeBeforeCreate = qcmRepository.findAll().size();
        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);
        restQcmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmDTO)))
            .andExpect(status().isCreated());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeCreate + 1);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testQcm.getSubjectContentType()).isEqualTo(DEFAULT_SUBJECT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createQcmWithExistingId() throws Exception {
        // Create the Qcm with an existing ID
        qcm.setId(1L);
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        int databaseSizeBeforeCreate = qcmRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQcmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllQcms() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        // Get all the qcmList
        restQcmMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(qcm.getId().intValue())))
            .andExpect(jsonPath("$.[*].subjectContentType").value(hasItem(DEFAULT_SUBJECT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(Base64Utils.encodeToString(DEFAULT_SUBJECT))));
    }

    @Test
    @Transactional
    void getQcm() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        // Get the qcm
        restQcmMockMvc
            .perform(get(ENTITY_API_URL_ID, qcm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(qcm.getId().intValue()))
            .andExpect(jsonPath("$.subjectContentType").value(DEFAULT_SUBJECT_CONTENT_TYPE))
            .andExpect(jsonPath("$.subject").value(Base64Utils.encodeToString(DEFAULT_SUBJECT)));
    }

    @Test
    @Transactional
    void getNonExistingQcm() throws Exception {
        // Get the qcm
        restQcmMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewQcm() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();

        // Update the qcm
        Qcm updatedQcm = qcmRepository.findById(qcm.getId()).get();
        // Disconnect from session so that the updates on updatedQcm are not directly saved in db
        em.detach(updatedQcm);
        updatedQcm.subject(UPDATED_SUBJECT).subjectContentType(UPDATED_SUBJECT_CONTENT_TYPE);
        QcmDTO qcmDTO = qcmMapper.toDto(updatedQcm);

        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, qcmDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmDTO))
            )
            .andExpect(status().isOk());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testQcm.getSubjectContentType()).isEqualTo(UPDATED_SUBJECT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, qcmDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQcmWithPatch() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();

        // Update the qcm using partial update
        Qcm partialUpdatedQcm = new Qcm();
        partialUpdatedQcm.setId(qcm.getId());

        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQcm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQcm))
            )
            .andExpect(status().isOk());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testQcm.getSubjectContentType()).isEqualTo(DEFAULT_SUBJECT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateQcmWithPatch() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();

        // Update the qcm using partial update
        Qcm partialUpdatedQcm = new Qcm();
        partialUpdatedQcm.setId(qcm.getId());

        partialUpdatedQcm.subject(UPDATED_SUBJECT).subjectContentType(UPDATED_SUBJECT_CONTENT_TYPE);

        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQcm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQcm))
            )
            .andExpect(status().isOk());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testQcm.getSubjectContentType()).isEqualTo(UPDATED_SUBJECT_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, qcmDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcmDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcmDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // Create the Qcm
        QcmDTO qcmDTO = qcmMapper.toDto(qcm);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(qcmDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQcm() throws Exception {
        // Initialize the database
        qcmRepository.saveAndFlush(qcm);

        int databaseSizeBeforeDelete = qcmRepository.findAll().size();

        // Delete the qcm
        restQcmMockMvc.perform(delete(ENTITY_API_URL_ID, qcm.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
