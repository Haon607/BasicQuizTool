package org.example.databaseserver.objects.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    public Long questionOrder;
    public String questionText;
    public String picturePath;
    @OneToMany
    public Set<Answer> answers;
}
