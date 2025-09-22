package com.example.taskbackend.repository;
import com.example.taskbackend.model.task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
@Repository
public interface taskrepo extends JpaRepository<task, Long>{
        @Modifying
        @Transactional
        @Query("DELETE FROM task t WHERE t.projectName = :projectName")
        void deleteByProjectName(String projectName);
}
