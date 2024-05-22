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
import com.example.plangenback.utils.TitleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.min;

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
            Map<String, Object> result = new HashMap<>();

            LambdaQueryWrapper<Document> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Document::getCity, city);
            queryWrapper.eq(Document::getDisaster, disaster);
            Integer documentId = documentMapper.selectOne(queryWrapper).getId();
            result.put("documentId", documentId);
            result.put("mainTitle", documentMapper.selectOne(queryWrapper).getMainTitle());

            LambdaQueryWrapper<Title> queryWrapper2 = new LambdaQueryWrapper<>();
            queryWrapper2.eq(Title::getDocumentId, documentId);
            queryWrapper2.orderByAsc(Title::getSecNum);
            List<String> titleList = titleMapper.selectList(queryWrapper2)
                    .stream().map(Title::getContent).collect(Collectors.toList());
            result.put("titleList", titleList);

            titleList.sort(Comparator.naturalOrder());
            titleList.sort((o1, o2) -> {
                String id1 = TitleUtils.getTitleSec(o1);
                String id2 = TitleUtils.getTitleSec(o2);

                List<Integer> intList1 = Arrays.stream(id1.split("\\."))
                        .map(Integer::parseInt)
                        .collect(Collectors.toList());

                List<Integer> intList2 = Arrays.stream(id2.split("\\."))
                        .map(Integer::parseInt)
                        .collect(Collectors.toList());

                int length = Math.max(intList1.size(), intList2.size());
                for (int i = 0; i < length; i++) {
                    int num1 = i < intList1.size() ? intList1.get(i) : 0;
                    int num2 = i < intList2.size() ? intList2.get(i) : 0;
                    if (num1 != num2) {
                        return Integer.compare(num1, num2);
                    }
                }
                return 0;
            });

            return new ResponseResult<>(200, "success", result);
        }
        catch (Exception e) {
            return new ResponseResult<>(500, e.getMessage());
        }
    }

    @Override
    public ResponseResult getTextByTitle(Integer documentId, List<String> title) {
        try {
            List<Map<String, Object>> text = new ArrayList<>();
            for (String s : title) {
                LambdaQueryWrapper<Title> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.eq(Title::getDocumentId, documentId);
                queryWrapper.eq(Title::getContent, s);
                Integer titleId = titleMapper.selectOne(queryWrapper).getId();

                LambdaQueryWrapper<Text> queryWrapper1 = new LambdaQueryWrapper<>();
                queryWrapper1.eq(Text::getParentTitleId, titleId);
                Text text1 = textMapper.selectOne(queryWrapper1);
                String txt;
                if (text1 != null) {
                    txt = text1.getContent();
                }
                else {
                    txt = null;
                }

                Map<String, Object> textInfo = new HashMap<>();
                textInfo.put("title", s);
                textInfo.put("content", txt);
                text.add(textInfo);
            }



            return new ResponseResult<>(200, "success", text);
        }
        catch (Exception e) {
            return new ResponseResult<>(500, e.getMessage());
        }
    }
}