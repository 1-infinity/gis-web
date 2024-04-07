package com.example.plangenback.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.plangenback.entity.Document;
import com.example.plangenback.entity.Text;
import com.example.plangenback.entity.Title;
import com.example.plangenback.mapper.DocumentMapper;
import com.example.plangenback.mapper.TextMapper;
import com.example.plangenback.mapper.TitleMapper;
import com.example.plangenback.model.ResponseResult;
import com.example.plangenback.service.PlanQueryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlanQueryServiceImpl implements PlanQueryService {

    @Autowired
    private DocumentMapper documentMapper;
    @Autowired
    private TitleMapper titleMapper;
    @Autowired
    private TextMapper textMapper;

    @Override
    public ResponseResult getAllTitleByCityAndDisaster(String city, String disaster) {
        try {
            LambdaQueryWrapper<Document> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Document::getCity, city);
            queryWrapper.eq(Document::getDisaster, disaster);
            Integer documentId = documentMapper.selectOne(queryWrapper).getId();

            LambdaQueryWrapper<Title> queryWrapper2 = new LambdaQueryWrapper<>();
            queryWrapper2.eq(Title::getDocumentId, documentId);
            queryWrapper2.orderByAsc(Title::getSecNum);
            List<String> titleList = titleMapper.selectList(queryWrapper2)
                    .stream().map(Title::getContent).collect(Collectors.toList());

            return new ResponseResult<>(200, "success", titleList);
        }
        catch (Exception e) {
            return new ResponseResult<>(500, e.getMessage());
        }
    }

    @Override
    public ResponseResult getTextByTitle(Integer documentId, String title) {
        try {
            LambdaQueryWrapper<Title> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Title::getDocumentId, documentId);
            queryWrapper.eq(Title::getContent, title);
            Integer titleId = titleMapper.selectOne(queryWrapper).getId();

            LambdaQueryWrapper<Text> queryWrapper1 = new LambdaQueryWrapper<>();
            queryWrapper1.eq(Text::getParentTitleId, titleId);

            String text = textMapper.selectOne(queryWrapper1).getContent();

            return new ResponseResult<>(200, "success", text);
        }
        catch (Exception e) {
            return new ResponseResult<>(500, e.getMessage());
        }
    }
}
