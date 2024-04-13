package com.example.plangenback.service;


import com.example.plangenback.model.ResponseResult;

import java.util.List;

public interface PlanQueryService {
    ResponseResult getAllTitleByCityAndDisaster(String city, String disaster);
    ResponseResult getTextByTitle(Integer documentId, List<String> title);
}
