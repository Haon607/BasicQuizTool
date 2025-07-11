package org.example.databaseserver.controller;

import org.example.databaseserver.objects.entities.Player;
import org.example.databaseserver.repos.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/players")
public class PlayerController {
    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public ResponseEntity<List<Player>> getPlayers() {
        return ResponseEntity.ok().body(playerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        Optional<Player> player = playerRepository.findById(id);
        return player.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

/*    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @RequestBody Player player) {
        Optional<Player> existingPlayer = playerRepository.findById(id);
        if (existingPlayer.isPresent()) {
            player.setId(id);
            return ResponseEntity.ok().body(playerRepository.save(player));
        } else {
            return ResponseEntity.notFound().build();
        }
    }*/

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        return ResponseEntity.ok().body(playerRepository.save(player));
    }

    @PatchMapping("/{id}/{score}")
    public ResponseEntity<Player> setPlayerScore(@PathVariable Long id, @PathVariable Long score) {
        Optional<Player> playerObs = playerRepository.findById(id);
        if (playerObs.isEmpty()) return ResponseEntity.notFound().build();
        Player player = playerObs.get();
        player.score = score;
        return ResponseEntity.ok().body(playerRepository.save(player));
    }
}
