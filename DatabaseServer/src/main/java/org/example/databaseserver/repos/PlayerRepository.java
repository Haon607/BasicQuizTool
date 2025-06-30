package org.example.databaseserver.repos;

import org.example.databaseserver.objects.entities.Player;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends ListCrudRepository<Player, Long> {
}