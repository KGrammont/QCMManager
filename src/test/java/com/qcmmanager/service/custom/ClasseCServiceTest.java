package com.qcmmanager.service.custom;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.qcmmanager.domain.Classe;
import com.qcmmanager.repository.custom.ClasseCRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
public class ClasseCServiceTest {

    @Mock
    private ClasseCRepository classeRepository;

    @InjectMocks
    private ClasseCService classeService;

    @Test
    void shouldFindByProfIsCurrentUserWithoutEagerLoad() {
        PageRequest pageRequest = PageRequest.of(1, 1);
        Page<Classe> expectedPage = mock(Page.class);
        when(classeRepository.findByProfIsCurrentUser(pageRequest)).thenReturn(expectedPage);

        Page<Classe> page = classeService.findByProfIsCurrentUser(pageRequest, false);

        assertThat(page).isSameAs(expectedPage);
    }

    @Test
    void shouldFindByProfIsCurrentUserWithEagerLoad() {
        PageRequest pageRequest = PageRequest.of(1, 1);
        Page<Classe> expectedPage = mock(Page.class);
        when(classeRepository.findByProfIsCurrentUserWithEagerRelationships(pageRequest)).thenReturn(expectedPage);

        Page<Classe> page = classeService.findByProfIsCurrentUser(pageRequest, true);

        assertThat(page).isSameAs(expectedPage);
    }

    @Test
    void shouldFindIdsByProfIsCurrentUserWithEagerLoad() {
        List<Long> expectedIds = mock(List.class);
        when(classeRepository.findClasseIdsByProfIsCurrentUser()).thenReturn(expectedIds);

        List<Long> ids = classeService.findIdsByProfIsCurrentUser();

        assertThat(ids).isSameAs(expectedIds);
    }
}
