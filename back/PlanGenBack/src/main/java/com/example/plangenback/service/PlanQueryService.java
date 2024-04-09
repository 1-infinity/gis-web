package com.example.plangenback.service;


import com.example.plangenback.model.ResponseResult;

import java.util.List;

public interface PlanQueryService {
    public ResponseResult getAllTitleByCityAndDisaster(String city, String disaster);
    public ResponseResult getTextByTitle(Integer documentId, List<String> title);
}
