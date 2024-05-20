package com.example.plangenback.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TitleUtils {
    public static String getTitleSec(String title) {
        // 定义一个正则表达式来匹配前面的编号部分
        String regex = "^[\\d\\.]+";
        // 编译正则表达式
        Pattern pattern = Pattern.compile(regex);
        // 创建匹配器对象
        Matcher matcher = pattern.matcher(title);
        // 尝试找到匹配
        if (matcher.find()) {
            // 提取并打印匹配到的编号部分
            return matcher.group();
        } else {
            return null;
        }
    }
}
