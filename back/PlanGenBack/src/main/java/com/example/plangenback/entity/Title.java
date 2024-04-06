package com.example.plangenback.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("title")
public class Title {
    @TableId
    private Integer id;
    private Integer documentId;
    private Integer parentSecId;
    private String secNum;
    private String content;
}
