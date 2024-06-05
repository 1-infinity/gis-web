package com.example.plangenback.service;


import com.example.plangenback.model.ResponseResult;

import java.util.List;

public interface PlanQueryService {
    ResponseResult getAllDocuments(String city, String disaster);
    ResponseResult getAllTitleById(Integer id, String mainTitle);
    ResponseResult getTextByTitle(Integer documentId, List<String> title);
}
