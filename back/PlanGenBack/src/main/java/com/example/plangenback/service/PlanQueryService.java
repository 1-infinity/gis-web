package com.example.plangenback.service;


import com.example.plangenback.model.ResponseResult;

public interface PlanQueryService {
    public ResponseResult getAllTitleByCityAndDisaster(String city, String disaster);
    public ResponseResult getTextByTitle(String title);
}
