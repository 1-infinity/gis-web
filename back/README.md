# 说明

## 数据库相关

设计了三个表，分别是document, title, text

document中的一个字段表示一篇文档，表中的字段：

| 字段名     | 类型         | 说明             |
| ---------- | ------------ | ---------------- |
| id         | INT          | 文档的id         |
| main_title | varchar(255) | 文档的标题       |
| city       | varchar(45)  | 该文档对应的城市 |
| disaster   | varchar(45)  | 该文档对应的灾害 |

title中的一个字段表示一个标题：

| 字段名        | 类型         | 说明                                           |
| ------------- | ------------ | ---------------------------------------------- |
| id            | INT          | 标题的id                                       |
| document_id   | INT          | 标题所属文档的id                               |
| parent_sec_id | INT          | 该标题的父标题id，若为一级标题，则该字段为0    |
| sec_num       | varchar(45)  | 该标题的序号，如 2.1 等                        |
| content       | varchar(256) | 该标题的内容，如 1.1编制目的  （注：包含序号） |

text中的一个字段表示一段文字：

| 字段名          | 类型           | 说明             |
| --------------- | -------------- | ---------------- |
| id              | INT            | 文字的id         |
| document_id     | INT            | 文字对应文档的id |
| parent_title_id | INT            | 文字所属标题的id |
| content         | varchar(10000) | 文字内容         |

数据库的建表sql语句在planGenProj.sql中



## 后端相关



**运行前记得修改application.properties中的数据库连接设置**



提供了两个接口

```java
public ResponseResult getAllTitleByCityAndDisaster(@RequestParam String city, String disaster)
```

```java
public ResponseResult getTextByTitle(@RequestParam String title)
```



其中ResponseResult的定义如下：

```java
public class ResponseResult<T> implements Serializable {
    private Integer code;
    private String msg;
    private T data;
}
```

其中code是状态代码，msg是信息，data是传输的内容



在getAllTitleByCityAndDisaster接口中，返回一个列表，包含某城市的某灾害对应的预案文档的所有标题

在getTextByTitle接口中，返回一个string，包含某个标题对应的文字内容



项目的目录及其作用如下：

| 目录       | 用途                 |
| ---------- | -------------------- |
| controller |                      |
| entity     | 对应数据库表的实体类 |
| mapper     | 查询数据库的mapper类 |
| model      | 存放一些数据模型     |
| service    | 存放业务类接口和实现 |

