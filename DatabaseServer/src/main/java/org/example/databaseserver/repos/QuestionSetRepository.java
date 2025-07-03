package org.example.databaseserver.repos;

import org.example.databaseserver.objects.entities.QuestionSet;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionSetRepository extends ListCrudRepository<QuestionSet, Long> {
}