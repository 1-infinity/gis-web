package com.example.plangenback.entity;

import com.baomidou.mybatisplus.annotation.IdType;
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
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private Integer documentId;
    private Integer parentSecId;
    private String secNum;
    private String content;

    public Title(Integer documentId, Integer parentSecId, String secNum, String content) {
        this.documentId = documentId;
        this.parentSecId = parentSecId;
        this.secNum = secNum;
        this.content = content;
    }
}
