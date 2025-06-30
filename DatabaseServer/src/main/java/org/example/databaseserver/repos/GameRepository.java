package org.example.databaseserver.repos;

import org.example.databaseserver.objects.entities.Game;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends ListCrudRepository<Game, Long> {
}