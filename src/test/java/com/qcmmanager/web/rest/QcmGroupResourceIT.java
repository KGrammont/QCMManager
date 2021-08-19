package com.qcmmanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qcmmanager.IntegrationTest;
import com.qcmmanager.domain.Classe;
import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.QcmGroupRepository;
import com.qcmmanager.repository.QcmRepository;
import com.qcmmanager.security.AuthoritiesConstants;
import com.qcmmanager.service.dto.QcmGroupDTO;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.Set;
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

/**
 * Integration tests for the {@link QcmGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.PROF)
class QcmGroupResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/qcm-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QcmGroupRepository qcmGroupRepository;

    @Autowired
    private QcmRepository qcmRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQcmGroupMockMvc;

    private QcmGroup qcmGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QcmGroup createEntity(EntityManager em) {
        QcmGroup qcmGroup = new QcmGroup().name(DEFAULT_NAME).createdAt(DEFAULT_CREATED_AT);
        // Add required entity
        Classe classe;
        if (TestUtil.findAll(em, Classe.class).isEmpty()) {
            classe = ClasseResourceIT.createEntity(em);

            User student1 = UserResourceIT.createEntity(em);
            student1.setLogin(student1.getLogin() + "1");
            student1.setEmail(student1.getEmail() + "1");
            em.persist(student1);
            em.flush();
            User student2 = UserResourceIT.createEntity(em);
            student2.setLogin(student2.getLogin() + "2");
            student2.setEmail(student2.getEmail() + "2");
            em.persist(student2);
            em.flush();
            User student3 = UserResourceIT.createEntity(em);
            student3.setLogin(student3.getLogin() + "3");
            student3.setEmail(student3.getEmail() + "3");
            em.persist(student3);
            em.flush();

            classe.setStudents(Set.of(student1, student2, student3));
            em.persist(classe);
            em.flush();
        } else {
            classe = TestUtil.findAll(em, Classe.class).get(0);
        }
        qcmGroup.setClasse(classe);
        return qcmGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QcmGroup createUpdatedEntity(EntityManager em) {
        QcmGroup qcmGroup = new QcmGroup().name(UPDATED_NAME).createdAt(UPDATED_CREATED_AT);
        // Add required entity
        Classe classe;
        if (TestUtil.findAll(em, Classe.class).isEmpty()) {
            classe = ClasseResourceIT.createUpdatedEntity(em);
            em.persist(classe);
            em.flush();
        } else {
            classe = TestUtil.findAll(em, Classe.class).get(0);
        }
        qcmGroup.setClasse(classe);
        return qcmGroup;
    }

    @BeforeEach
    public void initTest() {
        qcmGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createQcmGroup() throws Exception {
        int databaseSizeBeforeCreate = qcmGroupRepository.findAll().size();
        // Create the QcmGroup
        restQcmGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isCreated());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeCreate + 1);
        QcmGroup testQcmGroup = qcmGroupList.get(qcmGroupList.size() - 1);
        assertThat(testQcmGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQcmGroup.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void createQcmGroupWithExistingId() throws Exception {
        // Create the QcmGroup with an existing ID
        qcmGroup.setId(1L);

        int databaseSizeBeforeCreate = qcmGroupRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQcmGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isBadRequest());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = qcmGroupRepository.findAll().size();
        // set the field null
        qcmGroup.setName(null);

        // Create the QcmGroup, which fails.

        restQcmGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isBadRequest());

        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        int databaseSizeBeforeTest = qcmGroupRepository.findAll().size();
        // set the field null
        qcmGroup.setCreatedAt(null);

        // Create the QcmGroup, which fails.

        restQcmGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isBadRequest());

        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void createQcmGroupAndDistribute() throws Exception {
        int databaseSizeBeforeCreate = qcmGroupRepository.findAll().size();
        int qcmDatabaseSizeBeforeCreate = qcmRepository.findAll().size();
        QcmGroupDTO qcmGroupDTO = new QcmGroupDTO();
        qcmGroupDTO.setName(qcmGroup.getName());
        qcmGroupDTO.setCreatedAt(qcmGroup.getCreatedAt());
        qcmGroupDTO.setClasse(qcmGroup.getClasse());
        qcmGroupDTO.setQcms(new FileInputStream("src/test/resources/pdf/qcm.pdf").readAllBytes());
        // Create the QcmGroup
        restQcmGroupMockMvc
            .perform(
                post(ENTITY_API_URL + "/distribute")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmGroupDTO))
            )
            .andExpect(status().isOk());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeCreate + 1);
        assertThat(qcmRepository.findAll().size()).isEqualTo(qcmDatabaseSizeBeforeCreate + 3);
        QcmGroup testQcmGroup = qcmGroupList.get(qcmGroupList.size() - 1);
        assertThat(testQcmGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQcmGroup.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testQcmGroup.getClasse()).isEqualTo(qcmGroup.getClasse());
    }

    @Test
    @Transactional
    void getAllQcmGroups() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        // Get all the qcmGroupList
        restQcmGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(qcmGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    @Transactional
    void getQcmGroup() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        // Get the qcmGroup
        restQcmGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, qcmGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(qcmGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingQcmGroup() throws Exception {
        // Get the qcmGroup
        restQcmGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewQcmGroup() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();

        // Update the qcmGroup
        QcmGroup updatedQcmGroup = qcmGroupRepository.findById(qcmGroup.getId()).get();
        // Disconnect from session so that the updates on updatedQcmGroup are not directly saved in db
        em.detach(updatedQcmGroup);
        updatedQcmGroup.name(UPDATED_NAME).createdAt(UPDATED_CREATED_AT);

        restQcmGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQcmGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQcmGroup))
            )
            .andExpect(status().isOk());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
        QcmGroup testQcmGroup = qcmGroupList.get(qcmGroupList.size() - 1);
        assertThat(testQcmGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQcmGroup.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, qcmGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(qcmGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQcmGroupWithPatch() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();

        // Update the qcmGroup using partial update
        QcmGroup partialUpdatedQcmGroup = new QcmGroup();
        partialUpdatedQcmGroup.setId(qcmGroup.getId());

        restQcmGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQcmGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQcmGroup))
            )
            .andExpect(status().isOk());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
        QcmGroup testQcmGroup = qcmGroupList.get(qcmGroupList.size() - 1);
        assertThat(testQcmGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQcmGroup.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateQcmGroupWithPatch() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();

        // Update the qcmGroup using partial update
        QcmGroup partialUpdatedQcmGroup = new QcmGroup();
        partialUpdatedQcmGroup.setId(qcmGroup.getId());

        partialUpdatedQcmGroup.name(UPDATED_NAME).createdAt(UPDATED_CREATED_AT);

        restQcmGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQcmGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQcmGroup))
            )
            .andExpect(status().isOk());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
        QcmGroup testQcmGroup = qcmGroupList.get(qcmGroupList.size() - 1);
        assertThat(testQcmGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQcmGroup.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, qcmGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcmGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(qcmGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQcmGroup() throws Exception {
        int databaseSizeBeforeUpdate = qcmGroupRepository.findAll().size();
        qcmGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQcmGroupMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(qcmGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the QcmGroup in the database
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQcmGroup() throws Exception {
        // Initialize the database
        qcmGroupRepository.saveAndFlush(qcmGroup);

        int databaseSizeBeforeDelete = qcmGroupRepository.findAll().size();

        // Delete the qcmGroup
        restQcmGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, qcmGroup.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<QcmGroup> qcmGroupList = qcmGroupRepository.findAll();
        assertThat(qcmGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
