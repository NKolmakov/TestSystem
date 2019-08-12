package com.ggkttd.kolmakov.testSystem.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20,message = "Invalid user name length")
    private String name;

    @NotBlank
    @Size(max = 20, message = "Invalid user surname length")
    private String surname;

    @NotBlank
    @Size(max = 30,message = "Invalid user login length")
    private String login;

    @NotBlank
    @Size(max = 50,message = "Invalid user password length")
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    private boolean isAuthorized;
}
