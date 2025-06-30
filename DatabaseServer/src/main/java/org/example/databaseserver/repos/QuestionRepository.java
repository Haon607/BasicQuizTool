package org.example.databaseserver.repos;

import org.example.databaseserver.objects.entities.Question;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionRepository extends ListCrudRepository<Question, Long> {
    Optional<Question> findByQuestionOrder(Long order);
}