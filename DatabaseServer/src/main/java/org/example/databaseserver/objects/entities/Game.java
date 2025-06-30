package org.example.databaseserver.objects.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gameIdSequence")
    public Long id;

    @ManyToMany(fetch = FetchType.EAGER)
    public List<Player> players;

    @Column(columnDefinition = "text")
    public String touchComponents; // raw JSON string in the DB

    public Boolean hasStarted;

    // ObjectMapper can be static since it's thread-safe
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Transient getter: returns parsed JSON
    @Transient
    @JsonProperty("touchComponents")
    public List<Map<String, Object>> getTouchComponentsJson() throws JsonProcessingException {
        if (touchComponents == null || touchComponents.isEmpty()) return null;
        return objectMapper.readValue(touchComponents, new TypeReference<>() {});
    }

    // Optional setter for API deserialization
    @JsonProperty("touchComponents")
    public void setTouchComponentsJson(List<Map<String, Object>> components) throws JsonProcessingException {
        this.touchComponents = objectMapper.writeValueAsString(components);
    }
}

