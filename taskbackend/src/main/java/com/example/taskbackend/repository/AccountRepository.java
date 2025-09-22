package com.example.taskbackend.repository;

import com.example.taskbackend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByAccountName(String accountName);
}
