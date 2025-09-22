package com.example.taskbackend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.taskbackend.model.user;
import java.util.List;
import java.util.Optional;
public interface userrepo extends JpaRepository<user, Long> {
    Optional<user> findByEmail(String email);
    List<user> findByPmTrue();
}
