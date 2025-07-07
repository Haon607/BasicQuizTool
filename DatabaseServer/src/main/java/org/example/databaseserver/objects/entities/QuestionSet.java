package org.example.databaseserver.objects.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class QuestionSet {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "playerIdSequence")
    public Long id;
    public String name;
    public Boolean sound;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderColumn(name = "question_order")
    public List<Question> questions;
}
