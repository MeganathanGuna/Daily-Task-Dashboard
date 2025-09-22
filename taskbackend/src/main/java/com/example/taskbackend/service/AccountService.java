package com.example.taskbackend.service;

import com.example.taskbackend.model.Account;
import com.example.taskbackend.model.Project;
import com.example.taskbackend.repository.AccountRepository;
import com.example.taskbackend.repository.ProjectRepository;
import com.example.taskbackend.repository.taskrepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountService {
    private final AccountRepository accountRepo;
    private final ProjectRepository projectRepo;
    private final taskrepo taskRepo;

    public AccountService(AccountRepository accountRepo, ProjectRepository projectRepo, taskrepo taskRepo) {
        this.accountRepo = accountRepo;
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
    }

    public List<Account> getAllAccounts() {
        return accountRepo.findAll();
    }

    public Account createAccount(Account account) {
        if (accountRepo.existsByAccountName(account.getAccountName())) {
            throw new RuntimeException("Account already exists: " + account.getAccountName());
        }
        return accountRepo.save(account);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 🔹 Delete all tasks under all projects of this account
        for (Project project : account.getProjects()) {
            taskRepo.deleteByProjectName(project.getProjectName());
        }

        // 🔹 Delete all projects (cascade handled in JPA)
        projectRepo.deleteAll(account.getProjects());

        // 🔹 Finally delete account
        accountRepo.delete(account);
    }
}
