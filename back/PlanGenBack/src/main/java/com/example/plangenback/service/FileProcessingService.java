package com.example.plangenback.service;

import com.example.plangenback.model.PlanContentType;

import java.util.List;

public interface FileProcessingService {
    public void addFile(String mainTitle, String city, String disaster, List<PlanContentType> contents);
}
