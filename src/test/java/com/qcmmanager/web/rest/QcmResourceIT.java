package com.qcmmanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qcmmanager.IntegrationTest;
import com.qcmmanager.domain.Qcm;
import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.QcmRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

    private static final byte[] DEFAULT_QUESTION = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_QUESTION = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_QUESTION_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_QUESTION_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_ANSWER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ANSWER = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ANSWER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ANSWER_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_COMPLETE_ANSWER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_COMPLETE_ANSWER = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_COMPLETE_ANSWER_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CORRECTION = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CORRECTION = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CORRECTION_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CORRECTION_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/qcms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QcmRepository qcmRepository;

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
        Qcm qcm = new Qcm()
            .question(DEFAULT_QUESTION)
            .questionContentType(DEFAULT_QUESTION_CONTENT_TYPE)
            .answer(DEFAULT_ANSWER)
            .answerContentType(DEFAULT_ANSWER_CONTENT_TYPE)
            .completeAnswer(DEFAULT_COMPLETE_ANSWER)
            .completeAnswerContentType(DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE)
            .correction(DEFAULT_CORRECTION)
            .correctionContentType(DEFAULT_CORRECTION_CONTENT_TYPE)
            .createdAt(DEFAULT_CREATED_AT);
        // Add required entity
        QcmGroup qcmGroup;
        if (TestUtil.findAll(em, QcmGroup.class).isEmpty()) {
            qcmGroup = QcmGroupResourceIT.createEntity(em);
            em.persist(qcmGroup);
            em.flush();
        } else {
            qcmGroup = TestUtil.findAll(em, QcmGroup.class).get(0);
        }
        qcm.setQcmGroup(qcmGroup);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        qcm.setStudent(user);
        return qcm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Qcm createUpdatedEntity(EntityManager em) {
        Qcm qcm = new Qcm()
            .question(UPDATED_QUESTION)
            .questionContentType(UPDATED_QUESTION_CONTENT_TYPE)
            .answer(UPDATED_ANSWER)
            .answerContentType(UPDATED_ANSWER_CONTENT_TYPE)
            .completeAnswer(UPDATED_COMPLETE_ANSWER)
            .completeAnswerContentType(UPDATED_COMPLETE_ANSWER_CONTENT_TYPE)
            .correction(UPDATED_CORRECTION)
            .correctionContentType(UPDATED_CORRECTION_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);
        // Add required entity
        QcmGroup qcmGroup;
        if (TestUtil.findAll(em, QcmGroup.class).isEmpty()) {
            qcmGroup = QcmGroupResourceIT.createUpdatedEntity(em);
            em.persist(qcmGroup);
            em.flush();
        } else {
            qcmGroup = TestUtil.findAll(em, QcmGroup.class).get(0);
        }
        qcm.setQcmGroup(qcmGroup);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        qcm.setStudent(user);
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
        restQcmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcm)))
            .andExpect(status().isCreated());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeCreate + 1);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testQcm.getQuestionContentType()).isEqualTo(DEFAULT_QUESTION_CONTENT_TYPE);
        assertThat(testQcm.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testQcm.getAnswerContentType()).isEqualTo(DEFAULT_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCompleteAnswer()).isEqualTo(DEFAULT_COMPLETE_ANSWER);
        assertThat(testQcm.getCompleteAnswerContentType()).isEqualTo(DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCorrection()).isEqualTo(DEFAULT_CORRECTION);
        assertThat(testQcm.getCorrectionContentType()).isEqualTo(DEFAULT_CORRECTION_CONTENT_TYPE);
        assertThat(testQcm.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void createQcmWithExistingId() throws Exception {
        // Create the Qcm with an existing ID
        qcm.setId(1L);

        int databaseSizeBeforeCreate = qcmRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQcmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcm)))
            .andExpect(status().isBadRequest());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = qcmRepository.findAll().size();
        // set the field null
        qcm.setCreatedAt(null);

        // Create the Qcm, which fails.

        restQcmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcm)))
            .andExpect(status().isBadRequest());

        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeTest);
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
            .andExpect(jsonPath("$.[*].questionContentType").value(hasItem(DEFAULT_QUESTION_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].question").value(hasItem(Base64Utils.encodeToString(DEFAULT_QUESTION))))
            .andExpect(jsonPath("$.[*].answerContentType").value(hasItem(DEFAULT_ANSWER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(Base64Utils.encodeToString(DEFAULT_ANSWER))))
            .andExpect(jsonPath("$.[*].completeAnswerContentType").value(hasItem(DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].completeAnswer").value(hasItem(Base64Utils.encodeToString(DEFAULT_COMPLETE_ANSWER))))
            .andExpect(jsonPath("$.[*].correctionContentType").value(hasItem(DEFAULT_CORRECTION_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].correction").value(hasItem(Base64Utils.encodeToString(DEFAULT_CORRECTION))))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
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
            .andExpect(jsonPath("$.questionContentType").value(DEFAULT_QUESTION_CONTENT_TYPE))
            .andExpect(jsonPath("$.question").value(Base64Utils.encodeToString(DEFAULT_QUESTION)))
            .andExpect(jsonPath("$.answerContentType").value(DEFAULT_ANSWER_CONTENT_TYPE))
            .andExpect(jsonPath("$.answer").value(Base64Utils.encodeToString(DEFAULT_ANSWER)))
            .andExpect(jsonPath("$.completeAnswerContentType").value(DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE))
            .andExpect(jsonPath("$.completeAnswer").value(Base64Utils.encodeToString(DEFAULT_COMPLETE_ANSWER)))
            .andExpect(jsonPath("$.correctionContentType").value(DEFAULT_CORRECTION_CONTENT_TYPE))
            .andExpect(jsonPath("$.correction").value(Base64Utils.encodeToString(DEFAULT_CORRECTION)))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
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
        updatedQcm
            .question(UPDATED_QUESTION)
            .questionContentType(UPDATED_QUESTION_CONTENT_TYPE)
            .answer(UPDATED_ANSWER)
            .answerContentType(UPDATED_ANSWER_CONTENT_TYPE)
            .completeAnswer(UPDATED_COMPLETE_ANSWER)
            .completeAnswerContentType(UPDATED_COMPLETE_ANSWER_CONTENT_TYPE)
            .correction(UPDATED_CORRECTION)
            .correctionContentType(UPDATED_CORRECTION_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);

        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQcm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQcm))
            )
            .andExpect(status().isOk());

        // Validate the Qcm in the database
        List<Qcm> qcmList = qcmRepository.findAll();
        assertThat(qcmList).hasSize(databaseSizeBeforeUpdate);
        Qcm testQcm = qcmList.get(qcmList.size() - 1);
        assertThat(testQcm.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testQcm.getQuestionContentType()).isEqualTo(UPDATED_QUESTION_CONTENT_TYPE);
        assertThat(testQcm.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testQcm.getAnswerContentType()).isEqualTo(UPDATED_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCompleteAnswer()).isEqualTo(UPDATED_COMPLETE_ANSWER);
        assertThat(testQcm.getCompleteAnswerContentType()).isEqualTo(UPDATED_COMPLETE_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCorrection()).isEqualTo(UPDATED_CORRECTION);
        assertThat(testQcm.getCorrectionContentType()).isEqualTo(UPDATED_CORRECTION_CONTENT_TYPE);
        assertThat(testQcm.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, qcm.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcm))
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

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcm))
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

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcm)))
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

        partialUpdatedQcm.answer(UPDATED_ANSWER).answerContentType(UPDATED_ANSWER_CONTENT_TYPE).createdAt(UPDATED_CREATED_AT);

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
        assertThat(testQcm.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testQcm.getQuestionContentType()).isEqualTo(DEFAULT_QUESTION_CONTENT_TYPE);
        assertThat(testQcm.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testQcm.getAnswerContentType()).isEqualTo(UPDATED_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCompleteAnswer()).isEqualTo(DEFAULT_COMPLETE_ANSWER);
        assertThat(testQcm.getCompleteAnswerContentType()).isEqualTo(DEFAULT_COMPLETE_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCorrection()).isEqualTo(DEFAULT_CORRECTION);
        assertThat(testQcm.getCorrectionContentType()).isEqualTo(DEFAULT_CORRECTION_CONTENT_TYPE);
        assertThat(testQcm.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
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

        partialUpdatedQcm
            .question(UPDATED_QUESTION)
            .questionContentType(UPDATED_QUESTION_CONTENT_TYPE)
            .answer(UPDATED_ANSWER)
            .answerContentType(UPDATED_ANSWER_CONTENT_TYPE)
            .completeAnswer(UPDATED_COMPLETE_ANSWER)
            .completeAnswerContentType(UPDATED_COMPLETE_ANSWER_CONTENT_TYPE)
            .correction(UPDATED_CORRECTION)
            .correctionContentType(UPDATED_CORRECTION_CONTENT_TYPE)
            .createdAt(UPDATED_CREATED_AT);

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
        assertThat(testQcm.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testQcm.getQuestionContentType()).isEqualTo(UPDATED_QUESTION_CONTENT_TYPE);
        assertThat(testQcm.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testQcm.getAnswerContentType()).isEqualTo(UPDATED_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCompleteAnswer()).isEqualTo(UPDATED_COMPLETE_ANSWER);
        assertThat(testQcm.getCompleteAnswerContentType()).isEqualTo(UPDATED_COMPLETE_ANSWER_CONTENT_TYPE);
        assertThat(testQcm.getCorrection()).isEqualTo(UPDATED_CORRECTION);
        assertThat(testQcm.getCorrectionContentType()).isEqualTo(UPDATED_CORRECTION_CONTENT_TYPE);
        assertThat(testQcm.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingQcm() throws Exception {
        int databaseSizeBeforeUpdate = qcmRepository.findAll().size();
        qcm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, qcm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcm))
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

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcm))
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

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(qcm)))
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
