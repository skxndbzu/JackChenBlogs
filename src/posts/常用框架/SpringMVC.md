---
title: SpringMVC
icon: pen-to-square
order: 3
date: 2022-01-01
category:
  - SpringMVC
tag:
  - 运行原理
  - Restful
  - 请求处理
---



# MVC

## 基本介绍

SpringMVC：是一种基于 Java 实现 MVC 模型的轻量级 Web 框架

SpringMVC 优点：

- 使用简单
- 性能突出（对比现有的框架技术）
- 灵活性强

软件开发三层架构：

- 表现层：负责数据展示

- 业务层：负责业务处理

- 数据层：负责数据操作

  ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-MVC%E4%B8%89%E5%B1%82%E6%9E%B6%E6%9E%84.png)

MVC（Model View Controller），一种用于设计创建Web应用程序表现层的模式

- Model（模型）：数据模型，用于封装数据
- View（视图）：页面视图，用于展示数据
  - jsp  
  - html

- Controller（控制器）：处理用户交互的调度器，用于根据用户需求处理程序逻辑

  - Servlet
  - SpringMVC

  ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-MVC%E5%8A%9F%E8%83%BD%E5%9B%BE%E7%A4%BA.png)



参考视频：https://space.bilibili.com/37974444/



------





## 基本配置

### 入门项目

流程分析：

- 服务器启动
  1. 加载 web.xml 中 DispatcherServlet
  2. 读取 spring-mvc.xml 中的配置，加载所有 controller 包中所有标记为 bean 的类
  3. 读取 bean 中方法上方标注 @RequestMapping 的内容
- 处理请求
  1. DispatcherServlet 配置拦截所有请求 /
  2. 使用请求路径与所有加载的 @RequestMapping 的内容进行比对
  3. 执行对应的方法
  4. 根据方法的返回值在 webapp 目录中查找对应的页面并展示  

代码实现：

- pom.xml 导入坐标

  ```xml
  <modelVersion>4.0.0</modelVersion>
  
  <groupId>demo</groupId>
  <artifactId>spring_base_config</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>
  
  <properties>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
      <maven.compiler.source>1.8</maven.compiler.source>
      <maven.compiler.target>1.8</maven.compiler.target>
  </properties>
  
  <dependencies>
      <!-- servlet3.0规范的坐标 -->
      <dependency>
          <groupId>javax.servlet</groupId>
          <artifactId>javax.servlet-api</artifactId>
          <version>3.1.0</version>
          <scope>provided</scope>
      </dependency>
      <!--jsp坐标-->
      <dependency>
          <groupId>javax.servlet.jsp</groupId>
          <artifactId>jsp-api</artifactId>
          <version>2.1</version>
          <scope>provided</scope>
      </dependency>
      <!--spring的坐标-->
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-context</artifactId>
          <version>5.1.9.RELEASE</version>
      </dependency>
      <!--springmvc的坐标-->
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-webmvc</artifactId>
          <version>5.1.9.RELEASE</version>
      </dependency>
  </dependencies>
  
  <!--构建-->
  <build>
      <!--设置插件-->
      <plugins>
          <!--具体的插件配置-->
          <plugin>
              <groupId>org.apache.tomcat.maven</groupId>
              <artifactId>tomcat7-maven-plugin</artifactId>
              <version>2.1</version>
              <configuration>
                  <port>80</port>
                  <path>/</path>
              </configuration>
          </plugin>
      </plugins>
  </build>
  ```

- 设定具体 Controller，控制层 java / controller / UserController

  ```java
  @Controller  //@Component衍生注解
  public class UserController {
      //设定当前方法的访问映射地址，等同于Servlet在web.xml中的配置
      @RequestMapping("/save")
      //设置当前方法返回值类型为String，用于指定请求完成后跳转的页面
      public String save(){
          System.out.println("user mvc controller is running ...");
          //设定具体跳转的页面
      	return "success.jsp";
      }
  }
  ```

- webapp / WEB-INF / web.xml，配置SpringMVC核心控制器，请求转发到对应的具体业务处理器Controller中（等同于Servlet配置）

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
           version="3.1">
      <!--配置Servlet-->
      <servlet>
          <servlet-name>DispatcherServlet</servlet-name>
          <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
          <!--加载Spring控制文件-->
          <init-param>
              <param-name>contextConfigLocation</param-name>
              <param-value>classpath*:spring-mvc.xml</param-value>
          </init-param>
      </servlet>
      <servlet-mapping>
          <servlet-name>DispatcherServlet</servlet-name>
          <url-pattern>/</url-pattern>
      </servlet-mapping>
  </web-app>
  ```

- resouces / spring-mvc.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:context="http://www.springframework.org/schema/context"
         xmlns:mvc="http://www.springframework.org/schema/mvc"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans 
          http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/context
          http://www.springframework.org/schema/context/spring-context.xsd
          http://www.springframework.org/schema/mvc 
          http://www.springframework.org/schema/mvc/spring-mvc.xsd">
      <!--扫描加载所有的控制类-->
      <context:component-scan base-package="controller"/>
  </beans>
  ```



------



### 加载控制

Controller 加载控制：SpringMVC 的处理器对应的 bean 必须按照规范格式开发，未避免加入无效的 bean 可通过 bean 加载过滤器进行包含设定或排除设定，表现层 bean 标注通常设定为 @Controller  

- resources / spring-mvc.xml 配置

  ```xml
  <context:component-scan base-package="com.seazean">
      <context:include-filter 
  						type="annotation" 
  						expression="org.springframework.stereotype.Controller"/>
  </context:component-scan>
  ```

- 静态资源加载（webapp 目录下的相关资源），spring-mvc.xml 配置，开启 mvc 命名空间

  ```xml
  <!--放行指定类型静态资源配置方式-->
  <mvc:resources mapping="/img/**" location="/img/"/> <!--webapp/img/资源-->
  <mvc:resources mapping="/js/**" location="/js/"/>
  <mvc:resources mapping="/css/**" location="/css/"/>
  
  <!--SpringMVC 提供的通用资源放行方式，建议选择-->
  <mvc:default-servlet-handler/>
  ```

- 中文乱码处理 SpringMVC 提供专用的中文字符过滤器，用于处理乱码问题。配置在 web.xml 里面

  ```xml
  <!--乱码处理过滤器，与Servlet中使用的完全相同，差异之处在于处理器的类由Spring提供-->
  <filter>
      <filter-name>CharacterEncodingFilter</filter-name>
      <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
      <init-param>
          <param-name>encoding</param-name>
          <param-value>UTF-8</param-value>
      </init-param>
      <init-param>
              <param-name>forceRequestEncoding</param-name>
              <param-value>true</param-value>
          </init-param>
          <init-param>
              <param-name>forceResponseEncoding</param-name>
              <param-value>true</param-value>
          </init-param>
  </filter>
  <filter-mapping>
      <filter-name>CharacterEncodingFilter</filter-name>
      <url-pattern>/*</url-pattern>
  </filter-mapping>
  
  ```

源码如下：

```java
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String encoding = this.getEncoding();
        if (encoding != null) {
            if (this.isForceRequestEncoding() || request.getCharacterEncoding() == null) {
                request.setCharacterEncoding(encoding);
            }

            if (this.isForceResponseEncoding()) {
                response.setCharacterEncoding(encoding);
            }
        }

        filterChain.doFilter(request, response);
    }
```



------



### 注解驱动

WebApplicationContext，生成 Spring 核心容器（主容器/父容器/根容器）

- 父容器：Spring 环境加载后形成的容器，包含 Spring 环境下的所有的 bean
- 子容器：当前 mvc 环境加载后形成的容器，不包含 Spring 环境下的 bean
- 子容器可以访问父容器中的资源，父容器不可以访问子容器的资源

EnableWebMvc 注解作用：

- 支持 ConversionService 的配置，可以方便配置自定义类型转换器
- 支持 @NumberFormat 注解格式化数字类型
- 支持 @DateTimeFormat 注解格式化日期数据，日期包括 Date、Calendar
- 支持 @Valid 的参数校验（需要导入 JSR-303 规范）
- 配合第三方 jar 包和 SpringMVC 提供的注解读写 XML 和 JSON 格式数据

纯注解开发：

- 使用注解形式转化 SpringMVC 核心配置文件为配置类 java / config /  SpringMVCConfiguration.java

  ```java
  @Configuration
  @ComponentScan(value = "com.seazean", includeFilters = @ComponentScan.Filter(
      								type=FilterType.ANNOTATION,
      								classes = {Controller.class} )
      )
  //等同于<mvc:annotation-driven/>，还不完全相同
  @EnableWebMvc
  public class SpringMVCConfiguration implements WebMvcConfigurer{
      //注解配置通用放行资源的格式 建议使用
      @Override
      public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
          configurer.enable();
      }
  }
  
  ```

- 基于 servlet3.0 规范，自定义 Servlet 容器初始化配置类，加载 SpringMVC 核心配置类  

  ```java
  public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
      //创建Servlet容器时，使用注解方式加载SPRINGMVC配置类中的信息，
      //并加载成WEB专用的ApplicationContext对象该对象放入了ServletContext范围，
      //在整个WEB容器中可以随时获取调用
      @Override
      protected WebApplicationContext createServletApplicationContext() {
          A.C.W.A ctx = new AnnotationConfigWebApplicationContext();
          ctx.register(SpringMVCConfiguration.class);
          return ctx;
      }
  
      //注解配置映射地址方式，服务于SpringMVC的核心控制器DispatcherServlet
      @Override
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
  
      @Override
      protected WebApplicationContext createRootApplicationContext() {
          return null;
      }
  
      //乱码处理作为过滤器，在servlet容器启动时进行配置
      @Override
      public void onStartup(ServletContext servletContext) throws ServletException {
          super.onStartup(servletContext);
          CharacterEncodingFilter cef = new CharacterEncodingFilter();
          cef.setEncoding("UTF-8");
          FilterRegistration.Dynamic registration = servletContext.addFilter("characterEncodingFilter", cef);
          registration.addMappingForUrlPatterns(EnumSet.of(
             			DispatcherType.REQUEST,
              		DispatcherType.FORWARD,
              		DispatcherType.INCLUDE), false,"/*");
      }
  }
  
  ```





------



### 请求映射

名称：@RequestMapping

类型：方法注解、类注解

位置：处理器类中的方法定义上方、处理器类定义上方

- 方法注解

  作用：绑定请求地址与对应处理方法间的关系

  无类映射地址访问格式： http://localhost/requestURL2

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/requestURL2")
      public String requestURL2() {
          return "page.jsp";
      }
  }
  
  ```

- 类注解

  作用：为当前处理器中所有方法设定公共的访问路径前缀

  带有类映射地址访问格式，将类映射地址作为前缀添加在实际映射地址前面：**/user/requestURL1**

  最终返回的页面如果未设定绝对访问路径，将从类映射地址所在目录中查找 **webapp/user/page.jsp**

  ```java
  @Controller
  @RequestMapping("/user")
  public class UserController {
      @RequestMapping("/requestURL2")
      public String requestURL2() {
          return "page.jsp";
      }
  } 
  
  ```

- 常用属性

  ```java
  @RequestMapping(
      value="/requestURL3", //设定请求路径，与path属性、 value属性相同
      method = RequestMethod.GET, //设定请求方式
      params = "name", //设定请求参数条件
      headers = "content-type=text/*", //设定请求消息头条件
      consumes = "text/*", //用于指定可以接收的请求正文类型（MIME类型）
      produces = "text/*" //用于指定可以生成的响应正文类型（MIME类型）
  )
  public String requestURL3() {
      return "/page.jsp";
  }
  
  ```



------



## 基本操作

五种数据提交方式的优化
  1)单个提交数据
  页面:  

```html
  <form action="${pageContext.request.contextPath}/one.action">
      姓名:<input name="myname"><br>
      年龄:<input name="age"><br>
      <input type="submit" value="提交">
  </form> 
```

  action:

```java
@RequestMapping("/one")
  public String one(String myname,int age){  ===>自动注入,并且类型转换
      System.out.println("myname="+myname+",age="+(age+100));
      return "main";
  }
```

  2)对象封装提交数据
    在提交请求中,保证请求参数的名称与实体类中成员变量的名称一致,则可以自动创建对象,则可以自动提交数据,自动类型转换,自动封装数据到对象中.
    实体类:

```Java
 public class Users {
    private String name;
    private int age;
 }
```


​    页面:

```html
<form action="${pageContext.request.contextPath}/two.action" method="post">
    姓名:<input name="name"><br>
    年龄:<input name="age"><br>
    <input type="submit" value="提交">
</form>
```
​    action:

```java
   @RequestMapping("/two")
    public String two(Users u){
        System.out.println(u);
        return "main";
    }
```

  3.动态占位符提交
​    仅限于超链接或地址拦提交数据.它是一杠一值,一杠一大括号,使用注解@PathVariable来解析.      

```
<a href="${pageContext.request.contextPath}/three/张三/22.action">动态提交</a> 
```


​    

```java
@RequestMapping("/three/{uname}/{uage}")
   public String three(
           @PathVariable("uname")  ===>用来解析路径中的请求参数
           String name,
           @PathVariable("uage")
           int age){
       System.out.println("name="+name+",age="+(age+100));
       return "main";
   }
```

  4.映射名称不一致 
​    提交请求参数与action方法的形参的名称不一致,使用注解@RequestParam来解析
​   

```Java
 /**
   *  姓名:<input name="name"><br>
   *  年龄:<input name="age"><br>
   */
 @RequestMapping("/four")
 	public String four(
 	    @RequestParam("name")  ===>专门用来解决名称不一致的问题
 	    String uname,
 	    @RequestParam("age")
 	    int uage){
 	System.out.println("uname="+uname+",uage="+(uage+100));
 return "main";
 }
```

​    5.手工提取数据

```java
/**
  *  姓名:<input name="name"><br>
  *  年龄:<input name="age"><br>
  */
 @RequestMapping("/five")
    public String five(HttpServletRequest request){
      String name = request.getParameter("name");
      int age = Integer.parseInt(request.getParameter("age"));
      System.out.println("name="+name+",age="+(age+100));
      return "main";
    }   
```



### 请求处理

#### 普通类型

SpringMVC 将传递的参数封装到处理器方法的形参中，达到快速访问参数的目的

- 访问 URL：http://localhost/requestParam1?name=seazean&age=14  

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/requestParam1")
      public String requestParam1(String name ,int age){
          System.out.println("name=" + name + ",age=" + age);
          return "page.jsp";
      }
  }
  ```
  
```jsp
  <%@page pageEncoding="UTF-8" language="java" contentType="text/html;UTF-8" %>
  <html>
  <body>
  	<h1>请求参数测试页面</h1>
  </body>
  </html>
```

@RequestParam 的使用：

- 类型：形参注解

- 位置：处理器类中的方法形参前方

- 作用：绑定请求参数与对应处理方法形参间的关系

- 访问 URL：http://localhost/requestParam2?userName=Jock

  ```java
  @RequestMapping("/requestParam2")
  public String requestParam2(@RequestParam(
      name = "userName",
      required = true,	//为true代表必须有参数
      defaultValue = "s") String name){
      	System.out.println("name=" + name);
      	return "page.jsp";
  }
  
  ```



------



#### POJO类型

##### 简单类型

当 POJO 中使用简单类型属性时， 参数名称与 POJO 类属性名保持一致  

- 访问 URL： http://localhost/requestParam3?name=seazean&age=14  

  ```java
  @RequestMapping("/requestParam3")
  public String requestParam3(User user){
      System.out.println("name=" + user.getName());
      return "page.jsp";
  }
  
  ```

  ```java
  public class User {
      private String name;
      private Integer age;
      //......
  }
  
  ```



------



##### 参数冲突

当 POJO 类型属性与其他形参出现同名问题时，将被**同时赋值**，建议使用 @RequestParam 注解进行区分

- 访问 URL： http://localhost/requestParam4?name=seazean&age=14  

  ```java
  @RequestMapping("/requestParam4")
  public String requestParam4(User user, String age){
      System.out.println("user.age=" + user.getAge() + ",age=" + age);//14 14 
      return "page.jsp";
  }
  ```

------



##### 复杂类型

当 POJO 中出现对象属性时，参数名称与对象层次结构名称保持一致  

- 访问 URL： http://localhost/requestParam5?address.province=beijing  

  ```java
  @RequestMapping("/requestParam5")
  public String requestParam5(User user){
      System.out.println("user.address=" + user.getAddress().getProvince());
      return "page.jsp";
  }
  
  ```

  ```java
  public class User {
      private String name;
      private Integer age;
      private Address address; //....
  }
  
  ```

  ```java
  public class Address {
      private String province;
      private String city;
      private String address;
  }
  
  ```



------



##### 容器类型

POJO 中出现集合类型的处理方式

- 通过 URL 地址中同名参数，可以为 POJO 中的集合属性进行赋值，集合属性要求保存简单数据

  访问 URL：http://localhost/requestParam6?nick=Jock1&nick=Jockme&nick=zahc

  ```java
  @RequestMapping("/requestParam6")
  public String requestParam6(User user){
      System.out.println("user=" + user);
      //user = User{name='null',age=null,nick={Jock1,Jockme,zahc}}
      return "page.jsp";
  }
  
  ```

  ```java
  public class User {
      private String name;
      private Integer age;
      private List<String> nick;
  }
  
  ```

- POJO 中出现 List 保存对象数据，参数名称与对象层次结构名称保持一致，使用数组格式描述集合中对象的位置访问 URL：http://localhost/requestParam7?addresses[0].province=bj&addresses[1].province=tj  

  ```java
  @RequestMapping("/requestParam7")
  public String requestParam7(User user){
      System.out.println("user.addresses=" + user.getAddress());
      //{Address{provice=bj,city='null',address='null'}},{Address{....}}
      return "page.jsp";
  }
  
  ```

  ```java
  public class User {
      private String name;
      private Integer age;
      private List<Address> addresses;
  }
  
  ```

- POJO 中出现 Map 保存对象数据，参数名称与对象层次结构名称保持一致，使用映射格式描述集合中对象位置

  URL: http://localhost/requestParam8?addressMap[’home’].province=bj&addressMap[’job’].province=tj  

  ```java
  @RequestMapping("/requestParam8")
  public String requestParam8(User user){
      System.out.println("user.addressMap=" + user.getAddressMap());
      //user.addressMap={home=Address{p=,c=,a=},job=Address{....}}
      return "page.jsp";
  }
  
  ```

  ```java
  public class User {
      private Map<String,Address> addressMap;
      //....
  }
  
  ```



------



#### 数组集合

##### 数组类型

请求参数名与处理器方法形参名保持一致，且请求参数数量＞ 1个  

- 访问 URL： http://localhost/requestParam9?nick=Jockme&nick=zahc  

  ```java
  @RequestMapping("/requestParam9")
  public String requestParam9(String[] nick){
      System.out.println(nick[0] + "," + nick[1]);
      return "page.jsp";
  }
  
  ```



------



##### 集合类型

保存简单类型数据，请求参数名与处理器方法形参名保持一致，且请求参数数量＞ 1个

- 访问 URL： http://localhost/requestParam10?nick=Jockme&nick=zahc

  ```java
  @RequestMapping("/requestParam10")
  public String requestParam10(@RequestParam("nick") List<String> nick){
      System.out.println(nick);
      return "page.jsp";
  }
  
  ```

- 注意： SpringMVC 默认将 List 作为对象处理，赋值前先创建对象，然后将 nick **作为对象的属性**进行处理。List 是接口无法创建对象，报无法找到构造方法异常；修复类型为可创建对象的 ArrayList 类型后，对象可以创建但没有 nick 属性，因此数据为空
  解决方法：需要告知 SpringMVC 的处理器 nick 是一组数据，而不是一个单一属性。通过 @RequestParam 注解，将数量大于 1 个 names 参数打包成参数数组后， SpringMVC 才能识别该数据格式，并判定形参类型是否为数组或集合，并按数组或集合对象的形式操作数据



------



#### 转换器

##### 类型

开启转换配置：`<mvc:annotation-driven />  `
作用：提供 Controller 请求转发，Json 自动转换等功能

如果访问 URL：http://localhost/requestParam1?name=seazean&age=seazean，会出现报错，类型转化异常

```java
@RequestMapping("/requestParam1")
public String requestParam1(String name ,int age){
    System.out.println("name=" + name + ",age=" + age);
    return "page.jsp";
}

```

SpringMVC 对接收的数据进行自动类型转换，该工作通过 Converter 接口实现：

- 标量转换器
- 集合、数组相关转换器
- 默认转换器



------



##### 日期

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-date%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2.png)

如果访问 URL：http://localhost/requestParam11?date=1999-09-09 会报错，所以需要日期类型转换

- 声明自定义的转换格式并覆盖系统转换格式，配置 resources / spring-mvc.xml

  ```xml
  <!--5.启用自定义Converter-->
  <mvc:annotation-driven conversion-service="conversionService"/>
  <!--1.设定格式类型Converter，注册为Bean，受SpringMVC管理-->
  <bean id="conversionService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
      <!--2.自定义Converter格式类型设定，该设定使用的是同类型覆盖的思想-->
      <property name="formatters">
          <!--3.使用set保障相同类型的转换器仅保留一个，避免冲突-->
          <set>
              <!--4.设置具体的格式类型-->
              <bean class="org.springframework.format.datetime.DateFormatter">
                  <!--5.类型规则-->
                  <property name="pattern" value="yyyy-MM-dd"/>
              </bean>
          </set>
      </property>
  </bean>
  ```
  
- @DateTimeFormat
  类型：形参注解、成员变量注解
  位置：形参前面 或 成员变量上方
  作用：为当前参数或变量指定类型转换规则，将String类型的日期注入给Date类，其输出显示结果为Tue Jun 27 00:00:00 CST 2023，如果还想变得好看，必须再进行处理：使用SimpleDateFormat类的format方法把Date类型的结果转换成便于观看的**字符串**，simpleDateFormat.format(date)

  ```java
  public String requestParam12(@DateTimeFormat(pattern = "yyyy-MM-dd") Date date){
      System.out.println("date=" + date);
      return "page.jsp";
  }
  ```
  

如果形参是一个类，类里面有日期类，则在改类里面的日期类或者set方法里添加注解

  ```java
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private Date date;
  
@DateTimeFormat(pattern = "yyyy-MM-dd")
  public void setDate(Date date){
    this.date = date;
  }
  ```

  依赖注解驱动支持，xml 开启配置：

  ```xml
  <mvc:annotation-driven />  
  ```

- 类中全局日期处理
      注册一个注解,用来解析本类中所有的日期类型,自动转换.

  ```java
  @InitBinder
  public void initBinder(WebDataBinder dataBinder){
      dataBinder.registerCustomEditor(Date.class,new CustomDateEditor(sf,true));
  }
  ```

  注：**使用该方法可以不用配置注解驱动，@DateTimeFormat(pattern = "yyyy-MM-dd")也不需要使用，在有多个Date需要注入时使用很方便**

  

- 日期的显示处理
      在页面上显示好看的日期,必须使用JSTL.
      步骤:
     **添加依赖jstl**

```xml
      <dependency>
      <groupId>jstl</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>
```

**在页面上导入标签库** 

如果是单个日期对象,直接转为好看的格式化的字符串进行显示.
如果是list中的实体类对象的成员变量是日期类型,则必须使用jstl进行显示.
<%--导入jstl核心标签库--%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--导入jstl格式化标签库--%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

**使用标签显示数据**    

   <table width="800px" border="1">
    <tr>
        <th>姓名</th>
        <th>生日</th>
    </tr>
    	<c:forEach items="${list}" var="stu">
    <tr>
            <td>${stu.name}</td>
            <td>${stu.birthday}------ <fmt:formatDate value="${stu.birthday}" pattern="yyyy-MM-dd"></fmt:formatDate></td>
    </tr>
    	</c:forEach>
	</table>
**使用注解显示数据**

需要在类中的成员变量的get方法上加注解

```java
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public Date getBirthday() {
        return birthday;
    }
```



##### 自定义

自定义类型转换器，实现 Converter 接口或者直接容器中注入：

- 方式一：

  ```java
  public class WebConfig implements WebMvcConfigurer {
      @Bean
      public WebMvcConfigurer webMvcConfigurer() {
          return new WebMvcConfigurer() {
              @Override
              public void addFormatters(FormatterRegistry registry) {
                  registry.addConverter(new Converter<String, Date>() {
                      @Override
                      public Pet convert(String source) {
                      	DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
                          Date date = null;
                          //类型转换器无法预计使用过程中出现的异常，因此必须在类型转换器内部捕获，
                          //不允许抛出，框架无法预计此类异常如何处理
                          try {
                              date = df.parse(source);
                          } catch (ParseException e) {
                              e.printStackTrace();
                          }
                          return date;
                      }
                  });
          }
      }
  }
  ```
  
- 方式二：

  ```java
  //本例中的泛型填写的是String，Date，最终出现字符串转日期时，该类型转换器生效
  public class MyDateConverter implements Converter<String, Date> {
      //重写接口的抽象方法，参数由泛型决定
      public Date convert(String source) {
          DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
          Date date = null;
          //类型转换器无法预计使用过程中出现的异常，因此必须在类型转换器内部捕获，
          //不允许抛出，框架无法预计此类异常如何处理
          try {
              date = df.parse(source);
          } catch (ParseException e) {
              e.printStackTrace();
          }
          return date;
      }
  }
  
  ```

  配置 resources / spring-mvc.xml，注册自定义转换器，将功能加入到 SpringMVC 转换服务 ConverterService 中

  ```xml
  <!--1.将自定义Converter注册为Bean，受SpringMVC管理-->
  <bean id="myDateConverter" class="converter.MyDateConverter"/>
  <!--2.设定自定义Converter服务bean-->
  <bean id="conversionService"
        class="org.springframework.context.support.ConversionServiceFactoryBean">
      <!--3.注入所有的自定义Converter，该设定使用的是同类型覆盖的思想-->
      <property name="converters">
          <!--4.set保障同类型转换器仅保留一个，去重规则以Converter<S,T>的泛型为准-->
          <set>
              <!--5.具体的类型转换器-->
              <ref bean="myDateConverter"/>
          </set>
      </property>
  </bean>
  
  <!--开启注解驱动，加载自定义格式化转换器对应的类型转换服务-->
  <mvc:annotation-driven conversion-service="conversionService"/>
  
  ```

- 使用转换器

  ```java
  @RequestMapping("/requestParam12")
  public String requestParam12(Date date){
      System.out.println(date);
      return "page.jsp";
  }
  
  ```

  



------



### 响应处理

#### 页面跳转

请求转发和重定向：

​    默认是请求转发，使用视图解析器拼接前缀后缀进行页面跳转

​    forward:可以屏蔽前缀和后缀的拼接

​	redirect:这组字符串可以屏蔽前缀和后缀的拼接，实现重定向跳转

​	

- 请求转发：

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/showPage1")
  	public String showPage1() {
     	 	System.out.println("user mvc controller is running ...");
      	return "forward:/WEB-INF/page/page.jsp;
  	}
  }
  
  ```

- 请求重定向：

  ```java
  @RequestMapping("/showPage2")
  public String showPage2() {
      System.out.println("user mvc controller is running ...");
      return "redirect:/WEB-INF/page/page.jsp";//不能访问WEB-INF下的资源
  }
  
  ```

页面访问快捷设定（InternalResourceViewResolver）：

- 展示页面的保存位置通常固定且结构相似，可以设定通用的访问路径简化页面配置，配置 spring-mvc.xml：

  ```xml
  <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
      <property name="prefix" value="/WEB-INF/pages/"/>
      <property name="suffix" value=".jsp"/>
  </bean>
  
  ```

- 简化

  ```java
  @RequestMapping("/showPage3")
  public String showPage3() {
      System.out.println("user mvc controller is running...");
      return "page";
  }
  @RequestMapping("/showPage4")
  public String showPage4() {
      System.out.println("user mvc controller is running...");
      return "forward:page";
  }
  
  @RequestMapping("/showPage5")
  public String showPage5() {
      System.out.println("user mvc controller is running...");
      return "redirect:page";
  }
  
  ```

- 如果未设定了返回值，使用 void 类型，则默认使用访问路径作页面地址的前缀后缀

  ```java
  //最简页面配置方式，使用访问路径作为页面名称，省略返回值
  @RequestMapping("/showPage6")
  public void showPage6() {
      System.out.println("user mvc controller is running ...");
  }
  
  ```



------



#### 数据跳转

ModelAndView 是 SpringMVC 提供的一个对象，该对象可以用作控制器方法的返回值（Model 同），实现携带数据跳转

作用：

- 设置数据，向请求域对象中存储数据
- 设置视图，逻辑视图

代码实现：

- 使用 HttpServletRequest 类型形参进行数据传递

  ```java
  @Controller
  public class BookController {
      @RequestMapping("/showPageAndData1")
      public String showPageAndData1(HttpServletRequest request) {
          request.setAttribute("name","seazean");
          return "page";
      }
  }
  
  ```

- 使用 Model 类型形参进行数据传递

  ```java
  @RequestMapping("/showPageAndData2")
  public String showPageAndData2(Model model) {
      model.addAttribute("name","seazean");
      Book book = new Book();
      book.setName("SpringMVC入门实战");
      book.setPrice(66.6d);
      //添加数据的方式，key对value
      model.addAttribute("book",book);
      return "page";
  }
  
  ```

  ```java
  public class Book {
      private String name;
      private Double price;
  }
  
  ```

- 使用 ModelAndView 类型形参进行数据传递，将该对象作为返回值传递给调用者  

  ```java
  @RequestMapping("/showPageAndData3")
  public ModelAndView showPageAndData3(ModelAndView modelAndView) {
      //ModelAndView mav = new ModelAndView(); 替换形参中的参数
      Book book  = new Book();
      book.setName("SpringMVC入门案例");
      book.setPrice(66.66d);
  
      //添加数据的方式，key对value
      modelAndView.addObject("book",book);
      modelAndView.addObject("name","Jockme");
      //设置页面的方式，该方法最后一次执行的结果生效
      modelAndView.setViewName("page");
      //返回值设定成ModelAndView对象
      return modelAndView;
  }
  
  ```

- ModelAndView 扩展

  ```java
  //ModelAndView对象支持转发的手工设定，该设定不会启用前缀后缀的页面拼接格式
  @RequestMapping("/showPageAndData4")
  public ModelAndView showPageAndData4(ModelAndView modelAndView) {
      modelAndView.setViewName("forward:/WEB-INF/page/page.jsp");
      return modelAndView;
  }
  
  //ModelAndView对象支持重定向的手工设定，该设定不会启用前缀后缀的页面拼接格式
  @RequestMapping("/showPageAndData5")
  public ModelAndView showPageAndData6(ModelAndView modelAndView) {
      modelAndView.setViewName("redirect:page.jsp");
      return modelAndView;
  }
  
  ```



------



#### JSON

注解：@ResponseBody

作用：将 Controller 的方法返回的对象通过适当的转换器转换为指定的格式之后，写入到 Response 的 body 区。如果返回值是字符串，那么直接将字符串返回客户端；如果是一个对象，会**将对象转化为 JSON**，返回客户端

注意：当方法上面没有写 ResponseBody，底层会将方法的返回值封装为 ModelAndView 对象

- 使用 HttpServletResponse 对象响应数据

  ```java
  @Controller
  public class AccountController {
      @RequestMapping("/showData1")
      public void showData1(HttpServletResponse response) throws IOException {
          response.getWriter().write("message");
      }
  }
  
  ```

- 使用 **@ResponseBody 将返回的结果作为响应内容**（页面显示），而非响应的页面名称

  ```java
  @RequestMapping("/showData2")
  @ResponseBody
  public String showData2(){
      return "{'name':'Jock'}";
  }
  
  ```

- 使用 jackson 进行 json 数据格式转化

  导入坐标：

  ```xml
  <!--json相关坐标3个-->
  <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.9.0</version>
  </dependency>
  
  <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.9.0</version>
  </dependency>
  
  <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-annotations</artifactId>
      <version>2.9.0</version>
  </dependency>
  
  ```

  ```java
  @RequestMapping("/showData3")
  @ResponseBody
  public String showData3() throws JsonProcessingException {
      Book book  = new Book();
      book.setName("SpringMVC入门案例");
      book.setPrice(66.66d);
  
      ObjectMapper om = new ObjectMapper();
      return om.writeValueAsString(book);
  }
  
  ```

- 使用 SpringMVC 提供的消息类型转换器将对象与集合数据自动转换为 JSON 数据

  ```java
  //使用SpringMVC注解驱动，对标注@ResponseBody注解的控制器方法进行结果转换，由于返回值为引用类型，自动调用jackson提供的类型转换器进行格式转换
  @RequestMapping("/showData4")
  @ResponseBody
  public Book showData4() {
      Book book  = new Book();
      book.setName("SpringMVC入门案例");
      book.setPrice(66.66d);
      return book;
  }
  
  ```

  - 手工添加信息类型转换器  

    ```xml
    <bean class="org.springframework.web.servlet.mvc.method.
                 annotation.RequestMappingHandlerAdapter">
        <property name="messageConverters">
            <list>
                <bean class="org.springframework.http.converter.
                          json.MappingJackson2HttpMessageConverter"/>
            </list>
        </property>
    </bean
    
    ```

  - 使用 SpringMVC 注解驱动：

    ```xml
    <!--开启springmvc注解驱动，对@ResponseBody的注解进行格式增强，追加其类型转换的功能，具体实现由MappingJackson2HttpMessageConverter进行-->
    <mvc:annotation-driven/>
    
    ```

- 转换集合类型数据

  ```java
  @RequestMapping("/showData5")
  @ResponseBody
  public List showData5() {
      Book book1  = new Book();
      book1.setName("SpringMVC入门案例");
      book1.setPrice(66.66d);
  
      Book book2  = new Book();
      book2.setName("SpringMVC入门案例");
      book2.setPrice(66.66d);
  
      ArrayList al = new ArrayList();
      al.add(book1);
      al.add(book2);
      return al;
  }
  
  ```



------



### Restful

#### 基本介绍

Rest（REpresentational State Transfer）：表现层状态转化，定义了**资源在网络传输中以某种表现形式进行状态转移**，即网络资源的访问方式

- 资源：把真实的对象数据称为资源，一个资源既可以是一个集合，也可以是单个个体；每一种资源都有特定的 URI（统一资源标识符）与之对应，如果获取这个资源，访问这个 URI 就可以，比如获取特定的班级 `/class/12`；资源也可以包含子资源，比如 `/classes/classId/teachers` 某个指定班级的所有老师
- 表现形式：资源是一种信息实体，它可以有多种外在表现形式，把资源具体呈现出来的形式比如 json、xml、image、txt 等等叫做它的"表现层/表现形式"
- 状态转移：描述的服务器端资源的状态，比如增删改查（通过 HTTP 动词实现）引起资源状态的改变，互联网通信协议 HTTP 协议，是一个**无状态协议**，所有的资源状态都保存在服务器端



------

**restful风格中请求方式GET、POST、PUT、DELETE分别表示查、增、改、删**

```
GET请求		                       对应                     查询
http://ip:port/工程名/book/1		HTTP请求GET		    表示要查询id为1的图书
http://ip:port/工程名/book		    HTTP请求GET		    表示查询全部的图书
 
POST请求	对应	添加
http://ip:port/工程名/book		    HTTP请求POST		    表示要添加一个图书
 
PUT请求		对应	修改
http://ip:port/工程名/book/1		HTTP请求PUT		    表示要修改id为1的图书信息
 
DELETE请求	对应	删除
http://ip:port/工程名/book/1		HTTP请求DELETE		表示要删除id为1的图书信息
```



#### 访问方式

Restful 是按照 Rest 风格访问网络资源

- 传统风格访问路径：http://localhost/user/get?id=1
- Rest 风格访问路径：http://localhost/user/1

优点：隐藏资源的访问行为，通过地址无法得知做的是何种操作，书写简化

Restful 请求路径简化配置方式：`@RestController = @Controller + @ResponseBody`

相关注解：@GetMapping 注解是 @RequestMapping 注解的衍生，所以效果是一样的，建议使用 @GetMapping 

- `@GetMapping("/poll")` = `@RequestMapping(value = "/poll",method = RequestMethod.GET)`

  ```java
  @RequestMapping(method = RequestMethod.GET)			// @GetMapping 就拥有了 @RequestMapping 的功能
  public @interface GetMapping {
      @AliasFor(annotation = RequestMapping.class)	// 与 RequestMapping 相通
  	String name() default "";
  }
  
  ```

- `@PostMapping("/push")` = `@RequestMapping(value = "/push",method = RequestMethod.POST)`

过滤器：HiddenHttpMethodFilter 是 SpringMVC 对 Restful 风格的访问支持的过滤器

代码实现：

- restful.jsp：

  - 页面表单**使用隐藏域提交请求类型**，参数名称固定为 _method，必须配合提交类型 method=post 使用
  - GET 请求通过地址栏可以发送，也可以通过设置 form 的请求方式提交
  - POST 请求必须通过 form 的请求方式提交

  ```html
  <h1>restful风格请求表单</h1>
  <!--切换请求路径为restful风格-->
  <form action="/user" method="post">
  	<!--一隐藏域，切换为PUT请求或DELETE请求，但是form表单的提交方式method属性必须填写post-->
  	<input name="_method" type="hidden" value="PUT"/>
  	<input value="REST-PUT 提交" type="submit"/>
  </form>
  
  ```

- java / controller / UserController

  ```java
  @RestController				//设置rest风格的控制器
  @RequestMapping("/user/")	//设置公共访问路径，配合下方访问路径使用
  public class UserController {
      @GetMapping("/user")
      //@RequestMapping(value = "/user",method = RequestMethod.GET)
      public String getUser(){
          return "GET-张三";
      }
  
      @PostMapping("/user")
      //@RequestMapping(value = "/user",method = RequestMethod.POST)
      public String saveUser(){
          return "POST-张三";
      }
  
      @PutMapping("/user")
      //@RequestMapping(value = "/user",method = RequestMethod.PUT)
      public String putUser(){
          return "PUT-张三";
      }
  
      @DeleteMapping("/user")
      //@RequestMapping(value = "/user",method = RequestMethod.DELETE)
      public String deleteUser(){
          return "DELETE-张三";
      }
  }
  
  ```

- 配置拦截器 web.xml

  ```xml
  <!--配置拦截器，解析请求中的参数_method，否则无法发起PUT请求与DELETE请求，配合页面表单使用-->
  <filter>
      <filter-name>HiddenHttpMethodFilter</filter-name>
      <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
  </filter>
  <filter-mapping>
      <filter-name>HiddenHttpMethodFilter</filter-name>
      <servlet-name>DispatcherServlet</servlet-name>
  </filter-mapping>
  
  ```



------



#### 参数注解

Restful 开发中的参数注解

```java
@GetMapping("{id}")
public String getMessage(@PathVariable("id") Integer id){
}

```

使用 @PathVariable 注解获取路径上配置的具名变量，一般在有多个参数的时候添加

其他注解：

- @RequestHeader：获取请求头
- @RequestParam：获取请求参数（指问号后的参数，url?a=1&b=2）
- @CookieValue：获取 Cookie 值
- @RequestAttribute：获取 request 域属性
- @RequestBody：获取请求体 [POST]
- @MatrixVariable：矩阵变量
- @ModelAttribute：自定义类型变量

```java
@RestController	
@RequestMapping("/user/")
public class UserController {
    //rest风格访问路径简化书写方式，配合类注解@RequestMapping使用
    @RequestMapping("{id}")
    public String restLocation2(@PathVariable Integer id){
        System.out.println("restful is running ....get:" + id);
        return "success.jsp";
    }

    //@RequestMapping(value = "{id}",method = RequestMethod.GET)
    @GetMapping("{id}")
    public String get(@PathVariable Integer id){
        System.out.println("restful is running ....get:" + id);
        return "success.jsp";
    }

    @PostMapping("{id}")
    public String post(@PathVariable Integer id){
        System.out.println("restful is running ....post:" + id);
        return "success.jsp";
    }

    @PutMapping("{id}")
    public String put(@PathVariable Integer id){
        System.out.println("restful is running ....put:" + id);
        return "success.jsp";
    }

    @DeleteMapping("{id}")
    public String delete(@PathVariable Integer id){
        System.out.println("restful is running ....delete:" + id);
        return "success.jsp";
    }
}

```





------



#### 识别原理

表单提交要使用 REST 时，会带上 `_method=PUT`，请求过来被 `HiddenHttpMethodFilter` 拦截，进行过滤操作

org.springframework.web.filter.HiddenHttpMethodFilter.doFilterInternal()：

```java
public class HiddenHttpMethodFilter extends OncePerRequestFilter {
    // 兼容的请求 PUT、DELETE、PATCH
    private static final List<String> ALLOWED_METHODS =
			Collections.unmodifiableList(Arrays.asList(HttpMethod.PUT.name(),
					HttpMethod.DELETE.name(), HttpMethod.PATCH.name()));
    // 隐藏域的名字
	public static final String DEFAULT_METHOD_PARAM = "_method";

	private String methodParam = DEFAULT_METHOD_PARAM;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        HttpServletRequest requestToUse = request;
        // 请求必须是 POST，
        if ("POST".equals(request.getMethod()) && request.getAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE) == null) {
            // 获取标签中 name="_method" 的 value 值
            String paramValue = request.getParameter(this.methodParam);
            if (StringUtils.hasLength(paramValue)) {
                // 转成大写
                String method = paramValue.toUpperCase(Locale.ENGLISH);
                // 兼容的请求方式
                if (ALLOWED_METHODS.contains(method)) {
                    // 包装请求
                    requestToUse = new HttpMethodRequestWrapper(request, method);
                }
            }
        }
        // 过滤器链放行的时候用wrapper。以后的方法调用getMethod是调用requesWrapper的
        filterChain.doFilter(requestToUse, response);
    }
}

```

Rest 使用客户端工具，如 Postman 可直接发送 put、delete 等方式请求不被过滤

改变默认的 `_method` 的方式：

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig{
    //自定义filter
    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter(){
        HiddenHttpMethodFilter methodFilter = new HiddenHttpMethodFilter();
        //通过set 方法自定义
        methodFilter.setMethodParam("_m");
        return methodFilter;
    }    
}

```



------



### Servlet

SpringMVC 提供访问原始 Servlet 接口的功能

- SpringMVC 提供访问原始 Servlet 接口 API 的功能，通过形参声明即可 

  ```java
  @RequestMapping("/servletApi")
  public String servletApi(HttpServletRequest request,
                           HttpServletResponse response, HttpSession session){
      System.out.println(request);
      System.out.println(response);
      System.out.println(session);
      request.setAttribute("name","seazean");
      System.out.println(request.getAttribute("name"));
      return "page.jsp";
  }
  
  ```

- Head 数据获取快捷操作方式
  名称：@RequestHeader
  类型：形参注解
  位置：处理器类中的方法形参前方
  作用：绑定请求头数据与对应处理方法形参间的关系
  范例：

  ```java
  快捷操作方式@RequestMapping("/headApi")
  public String headApi(@RequestHeader("Accept-Language") String headMsg){
      System.out.println(headMsg);
      return "page";
  }  
  
  ```

- Cookie 数据获取快捷操作方式
  名称：@CookieValue
  类型：形参注解
  位置：处理器类中的方法形参前方
  作用：绑定请求 Cookie 数据与对应处理方法形参间的关系
  范例：

  ```java
  @RequestMapping("/cookieApi")
  public String cookieApi(@CookieValue("JSESSIONID") String jsessionid){
      System.out.println(jsessionid);
      return "page";
  }  
  
  ```

- Session 数据获取
  名称：@SessionAttribute
  类型：形参注解
  位置：处理器类中的方法形参前方
  作用：绑定请求Session数据与对应处理方法形参间的关系
  范例：

  ```java
  @RequestMapping("/sessionApi")
  public String sessionApi(@SessionAttribute("name") String name){
      System.out.println(name);
      return "page.jsp";
  }
  //用于在session中放入数据
  @RequestMapping("/setSessionData")
  public String setSessionData(HttpSession session){
      session.setAttribute("name","seazean");
      return "page";
  }
  
  ```

- Session 数据设置
  名称：@SessionAttributes
  类型：类注解
  位置：处理器类上方
  作用：声明放入session范围的变量名称，适用于Model类型数据传参
  范例：

  ```java
  @Controller
  //设定当前类中名称为age和gender的变量放入session范围，不常用
  @SessionAttributes(names = {"age","gender"})
  public class ServletController {
  	//将数据放入session存储范围，Model对象实现数据set，@SessionAttributes注解实现范围设定
      @RequestMapping("/setSessionData2")
      public String setSessionDate2(Model model) {
          model.addAttribute("age",39);
          model.addAttribute("gender","男");
          return "page";
      }
      
      @RequestMapping("/sessionApi")
      public String sessionApi(@SessionAttribute("age") int age,
                               @SessionAttribute("gender") String gender){
          System.out.println(name);
          System.out.println(age);
          return "page";
      }
  }  
  
  ```

- spring-mvc.xml 配置

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:context="http://www.springframework.org/schema/context"
         xmlns:mvc="http://www.springframework.org/schema/mvc"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd
          http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
  
      <context:component-scan base-package="com.seazean"/>
      <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
          <property name="prefix" value="/WEB-INF/page/"/>
          <property name="suffix" value=".jsp"/>
      </bean>
      <mvc:annotation-driven/>
  </beans>
  
  ```

  



------



## 运行原理

### 技术架构

#### 组件介绍

核心组件：

- DispatcherServlet：核心控制器， 是 SpringMVC 的核心，整体流程控制的中心，所有的请求第一步都先到达这里，由其调用其它组件处理用户的请求，它就是在 web.xml 配置的核心 Servlet，有效的降低了组件间的耦合性

- HandlerMapping：处理器映射器， 负责根据请求找到对应具体的 Handler 处理器，SpringMVC 中针对配置文件方式、注解方式等提供了不同的映射器来处理

- Handler：处理器，其实就是 Controller，业务处理的核心类，通常由开发者编写，并且必须遵守 Controller 开发的规则，这样适配器才能正确的执行。例如实现 Controller 接口，将 Controller 注册到 IOC 容器中等

- HandlAdapter：处理器适配器，根据映射器中找到的 Handler，通过 HandlerAdapter 去执行 Handler，这是适配器模式的应用

- View Resolver：视图解析器， 将 Handler 中返回的逻辑视图（ModelAndView）解析为一个具体的视图（View）对象

- View：视图， View 最后对页面进行渲染将结果返回给用户，SpringMVC 框架提供了很多的 View 视图类型，包括：jstlView、freemarkerView、pdfView 等

  ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E6%8A%80%E6%9C%AF%E6%9E%B6%E6%9E%84.png)

优点：

- 与 Spring 集成，更好的管理资源
- 有很多参数解析器和视图解析器，支持的数据类型丰富
- 将映射器、处理器、视图解析器进行解耦，分工明确





------



#### 工作原理

在 Spring 容器初始化时会建立所有的 URL 和 Controller 的对应关系，保存到 Map<URL, Controller> 中，这样 request 就能快速根据 URL 定位到 Controller：

- 在 Spring IOC 容器初始化完所有单例 bean 后
- SpringMVC 会遍历所有的 bean，获取 Controller 中对应的 URL（这里获取 URL 的实现类有多个，用于处理不同形式配置的 Controller）
- 将每一个 URL 对应一个 Controller 存入 Map<URL, Controller> 中

注意：将 @Controller 注解换成 @Component，启动时不会报错，但是在浏览器中输入路径时会出现 404，说明 Spring 没有对所有的 bean 进行 URL 映射

**一个 Request 来了：**

- 监听端口，获得请求：Tomcat 监听 8080 端口的请求处理，根据路径调用了 web.xml 中配置的核心控制器 DispatcherServlet，`DispatcherServlet#doDispatch` 是**核心调度方法**
- **首先根据 URI 获取 HandlerMapping 处理器映射器**，RequestMappingHandlerMapping 用来处理 @RequestMapping 注解的映射规则，其中保存了所有 handler 的映射规则，最后包装成一个拦截器链返回，拦截器链对象持有 HandlerMapping。如果没有合适的处理请求的 HandlerMapping，说明请求处理失败，设置响应码 404 返回
- 根据映射器获取当前 handler，**处理器适配器执行处理方法**，适配器根据请求的 URL 去 handler 中寻找对应的处理方法：
  - 创建 ModelAndViewContainer (mav) 对象，用来填充数据，然后通过不同的**参数解析器**去解析 URL 中的参数，完成数据解析绑定，然后执行真正的 Controller 方法，完成 handle 处理
  - 方法执行完对**返回值**进行处理，没添加 @ResponseBody 注解的返回值使用视图处理器处理，把视图名称设置进入 mav 中
  - 对添加了 @ResponseBody 注解的 Controller 的按照普通的返回值进行处理，首先进行内容协商，找到一种浏览器可以接受（请求头 Accept）的并且服务器可以生成的数据类型，选择合适数据转换器，设置响应头中的数据类型，然后写出数据
  - 最后把 ModelAndViewContainer 和 ModelMap 中的数据**封装到 ModelAndView 对象**返回
- **视图解析**，根据返回值创建视图，请求转发 View 实例为 InternalResourceView，重定向 View 实例为 RedirectView。最后调用 view.render 进行页面渲染，结果派发
  - 请求转发时请求域中的数据不丢失，会把 ModelAndView 的数据设置到请求域中，获取 Servlet 原生的 RequestDispatcher，调用 `RequestDispatcher#forward` 实现转发
  - 重定向会造成请求域中的数据丢失，使用 Servlet 原生方式实现重定向 `HttpServletResponse#sendRedirect`



------



### 调度函数

请求进入原生的 HttpServlet 的 doGet() 方法处理，调用子类 FrameworkServlet 的 doGet() 方法，最终调用 DispatcherServlet 的 doService() 方法，为请求设置相关属性后调用 doDispatch()，请求和响应的以参数的形式传入

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E8%AF%B7%E6%B1%82%E7%9B%B8%E5%BA%94%E7%9A%84%E5%8E%9F%E7%90%86.png)

```java
// request 和 response 为 Java 原生的类
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    // 文件上传请求
    boolean multipartRequestParsed = false;
    // 异步管理器
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        ModelAndView mv = null;
        Exception dispatchException = null;

        try {
            // 文件上传相关请求
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);

            // 找到当前请求使用哪个 HandlerMapping （Controller 的方法）处理，返回执行链
            mappedHandler = getHandler(processedRequest);
            // 没有合适的处理请求的方式 HandlerMapping，请求失败，直接返回 404
            if (mappedHandler == null) {
                noHandlerFound(processedRequest, response);
                return;
            }

            // 根据映射器获取当前 handler 处理器适配器，用来【处理当前的请求】
            HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
            // 获取发出此次请求的方式
            String method = request.getMethod();
            // 判断请求是不是 GET 方法
            boolean isGet = HttpMethod.GET.matches(method);
            if (isGet || HttpMethod.HEAD.matches(method)) {
                long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
                    return;
                }
            }
			// 拦截器链的前置处理
            if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                return;
            }
            // 执行处理方法，返回的是 ModelAndView 对象，封装了所有的返回值数据
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

            if (asyncManager.isConcurrentHandlingStarted()) {
                return;
            }
			// 设置视图名字
            applyDefaultViewName(processedRequest, mv);
            // 执行拦截器链中的后置处理方法
            mappedHandler.applyPostHandle(processedRequest, response, mv);
        } catch (Exception ex) {
            dispatchException = ex;
        }
        
        // 处理程序调用的结果，进行结果派发
        processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
    }
    //....
}

```



笔记参考视频：https://www.bilibili.com/video/BV19K4y1L7MT



------



### 请求映射

#### 映射器

doDispatch() 中调用 getHandler 方法获取所有的映射器

总体流程：

- 所有的请求映射都在 HandlerMapping 中，**RequestMappingHandlerMapping 处理 @RequestMapping 注解的映射规则**
- 遍历所有的 HandlerMapping 看是否可以匹配当前请求，匹配成功后返回，匹配失败设置 HTTP 404 响应码
- 用户可以自定义的映射处理，也可以给容器中放入自定义 HandlerMapping

访问 URL：http://localhost:8080/user

```java
@GetMapping("/user")
public String getUser(){
    return "GET";
}
@PostMapping("/user")
public String postUser(){
    return "POST";
}
//。。。。。

```

HandlerMapping 处理器映射器，**保存了所有 `@RequestMapping`  和 `handler` 的映射规则**

```java
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        // 遍历所有的 HandlerMapping
        for (HandlerMapping mapping : this.handlerMappings) {
            // 尝试去每个 HandlerMapping 中匹配当前请求的处理
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}

```

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E8%8E%B7%E5%8F%96Controller%E5%A4%84%E7%90%86%E5%99%A8.png)

- `mapping.getHandler(request)`：调用 AbstractHandlerMapping#getHandler

  - `Object handler = getHandlerInternal(request)`：**获取映射器**，底层调用 RequestMappingInfoHandlerMapping 类的方法，又调用 AbstractHandlerMethodMapping#getHandlerInternal

    - `String lookupPath = initLookupPath(request)`：地址栏的 URI，这里的 lookupPath 为 /user

    - `this.mappingRegistry.acquireReadLock()`：加读锁防止其他线程并发修改

    - `handlerMethod = lookupHandlerMethod(lookupPath, request)`：获取当前 HandlerMapping 中的映射规则

      - `directPathMatches = this.mappingRegistry.getMappingsByDirectPath(lookupPath)`：获取当前的映射器与当前**请求的 URI 有关的所有映射规则**

        ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-HandlerMapping%E7%9A%84%E6%98%A0%E5%B0%84%E8%A7%84%E5%88%99.png)

      - `addMatchingMappings(directPathMatches, matches, request)`：**匹配某个映射规则**

        - `for (T mapping : mappings)`：遍历所有的映射规则
        - `match = getMatchingMapping(mapping, request)`：去匹配每一个映射规则，匹配失败返回 null
        - `matches.add(new Match())`：匹配成功后封装成匹配器添加到匹配集合中

      - `matches.sort(comparator)`：匹配集合排序

      - `Match bestMatch = matches.get(0)`：匹配完成只剩一个，直接获取返回对应的处理方法

      - `if (matches.size() > 1)`：当有多个映射规则符合请求时，报错

      - `return bestMatch.getHandlerMethod()`：返回匹配器中的处理方法

  - `executionChain = getHandlerExecutionChain(handler, request)`：**为当前请求和映射器的构建一个拦截器链**

    - `for (HandlerInterceptor interceptor : this.adaptedInterceptors)`：遍历所有的拦截器
    - `chain.addInterceptor(interceptor)`：把所有的拦截器添加到 HandlerExecutionChain 中，形成拦截器链

  - `return executionChain`：**返回拦截器链，HandlerMapping 是链的 handler 成员属性**



------



#### 适配器

doDispatch() 中调用 `HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler())`

```java
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        // 遍历所有的 HandlerAdapter
        for (HandlerAdapter adapter : this.handlerAdapters) {
            // 判断当前适配器是否支持当前 handle
            if (adapter.supports(handler)) {
                // 返回的是 【RequestMappingHandlerAdapter】
                // AbstractHandlerMethodAdapter#supports -> RequestMappingHandlerAdapter
                return adapter;
            }
        }
    }
    throw new ServletException();
}

```



------



#### 方法执行

实例代码：

```java
@GetMapping("/params")
public String param(Map<String, Object> map, Model model, HttpServletRequest request) {
    map.put("k1", "v1");			// 都可以向请求域中添加数据
    model.addAttribute("k2", "v2");	// 它们两个都在数据封装在 【BindingAwareModelMap】，继承自 LinkedHashMap
    request.setAttribute("m", "HelloWorld");
    return "forward:/success";
}

```

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-Model%E5%92%8CMap%E7%9A%84%E6%95%B0%E6%8D%AE%E8%A7%A3%E6%9E%90.png)

doDispatch() 中调用 `mv = ha.handle(processedRequest, response, mappedHandler.getHandler())` **使用适配器执行方法**

`AbstractHandlerMethodAdapter#handle` → `RequestMappingHandlerAdapter#handleInternal` → `invokeHandlerMethod`：

```java
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
                                           HttpServletResponse response, 
                                           HandlerMethod handlerMethod) throws Exception {
	// 封装成 SpringMVC 的接口，用于通用 Web 请求拦截器，使能够访问通用请求元数据，而不是用于实际处理请求
    ServletWebRequest webRequest = new ServletWebRequest(request, response);
    try {
        // WebDataBinder 用于【从 Web 请求参数到 JavaBean 对象的数据绑定】，获取创建该实例的工厂
        WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);
        // 创建 Model 实例，用于向模型添加属性
        ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
		// 方法执行器
        ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
        
        // 参数解析器，有很多
        if (this.argumentResolvers != null) {
            invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
        }
        // 返回值处理器，也有很多
        if (this.returnValueHandlers != null) {
            invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
        }
        // 设置数据绑定器
        invocableMethod.setDataBinderFactory(binderFactory);
        // 设置参数检查器
		invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);
   
        // 新建一个 ModelAndViewContainer 并进行初始化和一些属性的填充
        ModelAndViewContainer mavContainer = new ModelAndViewContainer();
            
        // 设置一些属性
        
        // 【执行目标方法】
        invocableMethod.invokeAndHandle(webRequest, mavContainer);
        // 异步请求
        if (asyncManager.isConcurrentHandlingStarted()) {
            return null;
        }
		// 【获取 ModelAndView 对象，封装了 ModelAndViewContainer】
        return getModelAndView(mavContainer, modelFactory, webRequest);
    }
    finally {
        webRequest.requestCompleted();
    }
}

```

ServletInvocableHandlerMethod#invokeAndHandle：执行目标方法

- `returnValue = invokeForRequest(webRequest, mavContainer, providedArgs)`：**执行自己写的 controller 方法，返回的就是自定义方法中 return 的值**

  `Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs)`：**参数处理的逻辑**，遍历所有的参数解析器解析参数或者将 URI 中的参数进行绑定，绑定完成后开始执行目标方法

  - `parameters = getMethodParameters()`：获取此处理程序方法的方法参数的详细信息

  - `Object[] args = new Object[parameters.length]`：存放所有的参数

  - `for (int i = 0; i < parameters.length; i++)`：遍历所有的参数

  - `args[i] = findProvidedArgument(parameter, providedArgs)`：获取调用方法时提供的参数，一般是空

  - `if (!this.resolvers.supportsParameter(parameter))`：**获取可以解析当前参数的参数解析器**

    `return getArgumentResolver(parameter) != null`：获取参数的解析是否为空

    - `for (HandlerMethodArgumentResolver resolver : this.argumentResolvers)`：遍历容器内所有的解析器

      `if (resolver.supportsParameter(parameter))`：是否支持当前参数

      - `PathVariableMethodArgumentResolver#supportsParameter`：**解析标注 @PathVariable 注解的参数**
      - `ModelMethodProcessor#supportsParameter`：解析 Map 和 Model 类型的参数，Model 和 Map 的作用一样
      - `ExpressionValueMethodArgumentResolver#supportsParameter`：解析标注 @Value 注解的参数
      - `RequestParamMapMethodArgumentResolver#supportsParameter`：**解析标注 @RequestParam 注解**
      - `RequestPartMethodArgumentResolver#supportsParameter`：解析文件上传的信息
      - `ModelAttributeMethodProcessor#supportsParameter`：解析标注 @ModelAttribute 注解或者不是简单类型
        - 子类 ServletModelAttributeMethodProcessor 是解析自定义类型 JavaBean 的解析器
        - 简单类型有 Void、Enum、Number、CharSequence、Date、URI、URL、Locale、Class

  - `args[i] = this.resolvers.resolveArgument()`：**开始解析参数，每个参数使用的解析器不同**

    `resolver = getArgumentResolver(parameter)`：获取参数解析器

    `return resolver.resolveArgument()`：开始解析

    - `PathVariableMapMethodArgumentResolver#resolveArgument`：@PathVariable，包装 URI 中的参数为 Map
    - `MapMethodProcessor#resolveArgument`：调用 `mavContainer.getModel()` 返回默认 BindingAwareModelMap 对象
    - `ModelAttributeMethodProcessor#resolveArgument`：**自定义的 JavaBean 的绑定封装**，下一小节详解

  `return doInvoke(args)`：**真正的执行 Controller 方法**

  - `Method method = getBridgedMethod()`：从 HandlerMethod 获取要反射执行的方法
  - `ReflectionUtils.makeAccessible(method)`：破解权限
  - `method.invoke(getBean(), args)`：执行方法，getBean 获取的是标记 @Controller 的 Bean 类，其中包含执行方法

- **进行返回值的处理，响应部分详解**，处理完成进入下面的逻辑



RequestMappingHandlerAdapter#getModelAndView：获取 ModelAndView 对象

- `modelFactory.updateModel(webRequest, mavContainer)`：Model 数据升级到会话域（**请求域中的数据在重定向时丢失**）
  - `updateBindingResult(request, defaultModel)`：把绑定的数据添加到 BindingAwareModelMap 中
- `if (mavContainer.isRequestHandled())`：判断请求是否已经处理完成了
- `ModelMap model = mavContainer.getModel()`：获取**包含 Controller 方法参数**的 BindingAwareModelMap（本节开头）
- `mav = new ModelAndView()`：**把 ModelAndViewContainer 和 ModelMap 中的数据封装到 ModelAndView** 
- `if (!mavContainer.isViewReference())`：是否是通过名称指定视图引用
- `if (model instanceof RedirectAttributes)`：判断 model 是否是重定向数据，如果是进行重定向逻辑
- `return mav`：**任何方法执行都会返回 ModelAndView 对象**



------



#### 参数解析

解析自定义的 JavaBean 为例，调用 ModelAttributeMethodProcessor#resolveArgument 处理参数的方法，通过合适的类型转换器把 URL 中的参数转换以后，利用反射获取 set 方法，注入到 JavaBean

- Person.java：

  ```java
  @Data
  @Component	//加入到容器中
  public class Person {
      private String userName;
      private Integer age;
      private Date birth;
  }
  ```

- Controller：

  ```java
  @RestController	//返回的数据不是页面
  public class ParameterController {
      // 数据绑定：页面提交的请求数据（GET、POST）都可以和对象属性进行绑定
      @GetMapping("/saveuser")
      public Person saveuser(Person person){
          return person;
      }
  }
  ```

- 访问 URL：http://localhost:8080/saveuser?userName=zhangsan&age=20

进入源码：ModelAttributeMethodProcessor#resolveArgument

- `name = ModelFactory.getNameForParameter(parameter)`：获取名字，此例就是 person

- `ann = parameter.getParameterAnnotation(ModelAttribute.class)`：是否有 ModelAttribute 注解

- `if (mavContainer.containsAttribute(name))`：ModelAndViewContainer 中是否包含 person 对象

- `attribute = createAttribute()`：**创建一个实例，空的 Person 对象**

- `binder = binderFactory.createBinder(webRequest, attribute, name)`：Web 数据绑定器，可以利用 Converters 将请求数据转成指定的数据类型，绑定到 JavaBean 中

- `bindRequestParameters(binder, webRequest)`：**利用反射向目标对象填充数据**

  `servletBinder = (ServletRequestDataBinder) binder`：类型强转

  `servletBinder.bind(servletRequest)`：绑定数据

  - `mpvs = new MutablePropertyValues(request.getParameterMap())`：获取请求 URI 参数中的 k-v 键值对

  - `addBindValues(mpvs, request)`：子类可以用来为请求添加额外绑定值

  - `doBind(mpvs)`：真正的绑定的方法，调用 `applyPropertyValues` 应用参数值，然后调用 `setPropertyValues` 方法

    `AbstractPropertyAccessor#setPropertyValues()`：

    - `List<PropertyValue> propertyValues`：获取到所有的参数的值，就是 URI 上的所有的参数值

    - `for (PropertyValue pv : propertyValues)`：遍历所有的参数值

    - `setPropertyValue(pv)`：**填充到空的 Person 实例中**

      - `nestedPa = getPropertyAccessorForPropertyPath(propertyName)`：获取属性访问器

      - `tokens = getPropertyNameTokens()`：获取元数据的信息

      - `nestedPa.setPropertyValue(tokens, pv)`：填充数据

      - `processLocalProperty(tokens, pv)`：处理属性

        - `if (!Boolean.FALSE.equals(pv.conversionNecessary))`：数据是否需要转换了

        - `if (pv.isConverted())`：数据已经转换过了，转换了直接赋值，没转换进行转换

        - `oldValue = ph.getValue()`：获取未转换的数据

        - `valueToApply = convertForProperty()`：进行数据转换

          `TypeConverterDelegate#convertIfNecessary`：进入该方法的逻辑

          - `if (conversionService.canConvert(sourceTypeDesc, typeDescriptor))`：判断能不能转换

            `GenericConverter converter = getConverter(sourceType, targetType)`：**获取类型转换器**

            - `converter = this.converters.find(sourceType, targetType)`：寻找合适的转换器

              - `sourceCandidates = getClassHierarchy(sourceType.getType())`：原数据类型

              - `targetCandidates = getClassHierarchy(targetType.getType())`：目标数据类型

                ```java
                for (Class<?> sourceCandidate : sourceCandidates) {
                    //双重循环遍历，寻找合适的转换器
                 	for (Class<?> targetCandidate : targetCandidates) {
                
                ```

              - `GenericConverter converter = getRegisteredConverter(..)`：匹配类型转换器

              - `return converter`：返回转换器

          - `conversionService.convert(newValue, sourceTypeDesc, typeDescriptor)`：开始转换

            - `converter = getConverter(sourceType, targetType)`：**获取可用的转换器**
            - `result = ConversionUtils.invokeConverter()`：执行转换方法
              - `converter.convert()`：**调用转换器的转换方法**（GenericConverter#convert）
            - `return handleResult(sourceType, targetType, result)`：返回结果

        - `ph.setValue(valueToApply)`：**设置 JavaBean 属性**（BeanWrapperImpl.BeanPropertyHandler）

          - `Method writeMethod`：获取写数据方法
            - `Class<?> cls = getClass0()`：获取 Class 对象
            - `writeMethodName = Introspector.SET_PREFIX + getBaseName()`：**set 前缀 + 属性名**
            - `writeMethod = Introspector.findMethod(cls, writeMethodName, 1, args)`：获取只包含一个参数的 set 方法
            - `setWriteMethod(writeMethod)`：加入缓存
          - `ReflectionUtils.makeAccessible(writeMethod)`：设置访问权限
          - `writeMethod.invoke(getWrappedInstance(), value)`：执行方法

- `bindingResult = binder.getBindingResult()`：获取绑定的结果

- `mavContainer.addAllAttributes(bindingResultModel)`：**把所有填充的参数放入 ModelAndViewContainer**

- `return attribute`：返回填充后的 Person 对象





------



### 响应处理

#### 响应数据

以 Person 为例：

```java
@ResponseBody  		// 利用返回值处理器里面的消息转换器进行处理，而不是视图
@GetMapping(value = "/person")
public Person getPerson(){
    Person person = new Person();
    person.setAge(28);
    person.setBirth(new Date());
    person.setUserName("zhangsan");
    return person;
}

```

直接进入方法执行完后的逻辑 ServletInvocableHandlerMethod#invokeAndHandle：

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
                            Object... providedArgs) throws Exception {
	// 【执行目标方法】，return person 对象
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    // 设置状态码
    setResponseStatus(webRequest);

    // 判断方法是否有返回值
    if (returnValue == null) {
        if (isRequestNotModified(webRequest) || getResponseStatus() != null || mavContainer.isRequestHandled()) {
            disableContentCachingIfNecessary(webRequest);
            mavContainer.setRequestHandled(true);
            return;
        }
    }	// 返回值是字符串
    else if (StringUtils.hasText(getResponseStatusReason())) {
        // 设置请求处理完成
        mavContainer.setRequestHandled(true);
        return;
	// 设置请求没有处理完成，还需要进行返回值的逻辑
    mavContainer.setRequestHandled(false);
    Assert.state(this.returnValueHandlers != null, "No return value handlers");
    try {
        // 【返回值的处理】
        this.returnValueHandlers.handleReturnValue(
            returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
    }
    catch (Exception ex) {}
}

```

- **没有加 @ResponseBody 注解的返回数据按照视图处理的逻辑**，ViewNameMethodReturnValueHandler（视图详解）
- 此例是加了注解的，返回的数据不是视图，HandlerMethodReturnValueHandlerComposite#handleReturnValue：

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest)  {
	// 获取合适的返回值处理器
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    if (handler == null) {
        throw new IllegalArgumentException();
    }
    // 使用处理器处理返回值（详解源码中的这两个函数）
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}

```

HandlerMethodReturnValueHandlerComposite#selectHandler：获取合适的返回值处理器

- `boolean isAsyncValue = isAsyncReturnValue(value, returnType)`：是否是异步请求
- `for (HandlerMethodReturnValueHandler handler : this.returnValueHandlers)`：遍历所有的返回值处理器
  - `RequestResponseBodyMethodProcessor#supportsReturnType`：**处理标注 @ResponseBody 注解的返回值**
  - `ModelAndViewMethodReturnValueHandler#supportsReturnType`：处理返回值类型是 ModelAndView 的处理器
  - `ModelAndViewResolverMethodReturnValueHandler#supportsReturnType`：直接返回 true，处理所有数据



RequestResponseBodyMethodProcessor#handleReturnValue：处理返回值，要进行**内容协商**

- `mavContainer.setRequestHandled(true)`：设置请求处理完成

- `inputMessage = createInputMessage(webRequest)`：获取输入的数据

- `outputMessage = createOutputMessage(webRequest)`：获取输出的数据

- `writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage)`：使用消息转换器进行写出

  - `if (value instanceof CharSequence)`：判断返回的数据是不是字符类型

  - `body = value`：把 value 赋值给 body，此时 body 中就是自定义方法执行完后的 Person 对象

  - `if (isResourceType(value, returnType))`：当前数据是不是流数据

  - `MediaType selectedMediaType`：**内容协商后选择使用的类型，浏览器和服务器都支持的媒体（数据）类型**

  - `MediaType contentType = outputMessage.getHeaders().getContentType()`：获取响应头的数据

  - `if (contentType != null && contentType.isConcrete())`：判断当前响应头中是否已经有确定的媒体类型

    `selectedMediaType = contentType`：前置处理已经使用了媒体类型，直接继续使用该类型

  - `acceptableTypes = getAcceptableMediaTypes(request)`：**获取浏览器支持的媒体类型，请求头字段**

    - `this.contentNegotiationManager.resolveMediaTypes()`：调用该方法
    - `for(ContentNegotiationStrategy strategy:this.strategies)`：**默认策略是提取请求头的字段的内容**，策略类为HeaderContentNegotiationStrategy，可以配置添加其他类型的策略
      - `List<MediaType> mediaTypes = strategy.resolveMediaTypes(request)`：解析 Accept 字段存储为 List
        - `headerValueArray = request.getHeaderValues(HttpHeaders.ACCEPT)`：获取请求头中 Accept 字段
        - `List<MediaType> mediaTypes = MediaType.parseMediaTypes(headerValues)`：解析成 List 集合
        - `MediaType.sortBySpecificityAndQuality(mediaTypes)`：按照相对品质因数 q 降序排序

  ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%94%AF%E6%8C%81%E6%8E%A5%E6%94%B6%E7%9A%84%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.png)

- `producibleTypes = getProducibleMediaTypes(request, valueType, targetType)`：**服务器能生成的媒体类型**

  - `request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE)`：从请求域获取默认的媒体类型
    - ` for (HttpMessageConverter<?> converter : this.messageConverters)`：遍历所有的消息转换器
    - `converter.canWrite(valueClass, null)`：是否支持当前的类型
    - ` result.addAll(converter.getSupportedMediaTypes())`：把当前 MessageConverter 支持的所有类型放入 result

- `List<MediaType> mediaTypesToUse = new ArrayList<>()`：存储最佳匹配的集合

- **内容协商：**

  ```java
    for (MediaType requestedType : acceptableTypes) {				// 遍历所有浏览器能接受的媒体类型
        for (MediaType producibleType : producibleTypes) {		// 遍历所有服务器能产出的
            if (requestedType.isCompatibleWith(producibleType)) {	// 判断类型是否匹配，最佳匹配
                // 数据协商匹配成功，一般有多种
                mediaTypesToUse.add(getMostSpecificMediaType(requestedType, producibleType));
            }
        }
    }
  
  ```

- `MediaType.sortBySpecificityAndQuality(mediaTypesToUse)`：按照相对品质因数 q 排序，降序排序，越大的越好

- `for (MediaType mediaType : mediaTypesToUse)`：**遍历所有的最佳匹配**，选择一种赋值给选择的类型

- `selectedMediaType = selectedMediaType.removeQualityValue()`：媒体类型去除相对品质因数

- `for (HttpMessageConverter<?> converter : this.messageConverters)`：**遍历所有的 HTTP 数据转换器**

- `GenericHttpMessageConverter genericConverter`：**MappingJackson2HttpMessageConverter 可以将对象写为 JSON**

- `((GenericHttpMessageConverter) converter).canWrite()`：判断转换器是否可以写出给定的类型

  `AbstractJackson2HttpMessageConverter#canWrit`

  - `if (!canWrite(mediaType))`：是否可以写出指定类型
    - `MediaType.ALL.equalsTypeAndSubtype(mediaType)`：是不是 `*/*` 类型
    - `getSupportedMediaTypes()`：支持 `application/json` 和 `application/*+json` 两种类型
      - `return true`：返回 true
    - `objectMapper = selectObjectMapper(clazz, mediaType)`：选择可以使用的 objectMapper 
    - `causeRef = new AtomicReference<>()`：获取并发安全的引用
    - `if (objectMapper.canSerialize(clazz, causeRef))`：objectMapper 可以序列化当前类
    - `return true`：返回 true
  - ` body = getAdvice().beforeBodyWrite()`：**获取要响应的所有数据，就是 Person 对象**

- `addContentDispositionHeader(inputMessage, outputMessage)`：检查路径

- `genericConverter.write(body, targetType, selectedMediaType, outputMessage)`：调用消息转换器的 write 方法

  `AbstractGenericHttpMessageConverter#write`：该类的方法

  - `addDefaultHeaders(headers, t, contentType)`：**设置响应头中的数据类型**

    ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AE%BE%E7%BD%AE%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B.png)

  - `writeInternal(t, type, outputMessage)`：**数据写出为 JSON 格式**

    - `Object value = object`：value 引用 Person 对象
    - `ObjectWriter objectWriter = objectMapper.writer()`：获取 ObjectWriter 对象
    - `objectWriter.writeValue(generator, value)`：使用 ObjectWriter 写出数据为 JSON





------



#### 协商策略

开启基于请求参数的内容协商模式：（SpringBoot 方式）

```yaml
spring.mvc.contentnegotiation:favor-parameter: true  # 开启请求参数内容协商模式

```

发请求： http://localhost:8080/person?format=json，解析 format

策略类为 ParameterContentNegotiationStrategy，运行流程如下：

- `acceptableTypes = getAcceptableMediaTypes(request)`：获取浏览器支持的媒体类型

  `mediaTypes = strategy.resolveMediaTypes(request)`：解析请求 URL 参数中的数据

  - `return resolveMediaTypeKey(webRequest, getMediaTypeKey(webRequest))`：

    `getMediaTypeKey(webRequest)`：

    - `request.getParameter(getParameterName())`：获取 URL 中指定的需求的数据类型
      - `getParameterName()`：获取参数的属性名 format
      - `getParameter()`：**获取 URL 中 format 对应的数据**

    `resolveMediaTypeKey()`：解析媒体类型，封装成集合

自定义内容协商策略：

```java
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override	//自定义内容协商策略
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                Map<String, MediaType> mediaTypes = new HashMap<>();
                mediaTypes.put("json", MediaType.APPLICATION_JSON);
                mediaTypes.put("xml",MediaType.APPLICATION_XML);
                mediaTypes.put("person",MediaType.parseMediaType("application/x-person"));
                // 指定支持解析哪些参数对应的哪些媒体类型
                ParameterContentNegotiationStrategy parameterStrategy = new ParameterContentNegotiationStrategy(mediaTypes);

                // 请求头解析
                HeaderContentNegotiationStrategy headStrategy = new HeaderContentNegotiationStrategy();

                // 添加到容器中，即可以解析请求头 又可以解析请求参数
                configurer.strategies(Arrays.asList(parameterStrategy,headStrategy));
            }
            
            @Override 	// 自定义消息转换器
            public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(new GuiguMessageConverter());
            }
        }
    }
}

```

也可以自定义 HttpMessageConverter，实现 `HttpMessageConverter<T>` 接口重写方法即可



------



### 视图解析

#### 返回解析

请求处理：

```java
@GetMapping("/params")
public String param(){
	return "forward:/success";
    //return "redirect:/success";
}

```

进入执行方法逻辑 ServletInvocableHandlerMethod#invokeAndHandle，进入 `this.returnValueHandlers.handleReturnValue`：

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest)  {
	// 获取合适的返回值处理器：调用 if (handler.supportsReturnType(returnType))判断是否支持
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    if (handler == null) {
        throw new IllegalArgumentException();
    }
    // 使用处理器处理返回值
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}

```

- ViewNameMethodReturnValueHandler#supportsReturnType：

  ```java
  public boolean supportsReturnType(MethodParameter returnType) {
      Class<?> paramType = returnType.getParameterType();
      // 返回值是否是 void 或者是 CharSequence 字符序列，这里是字符序列
      return (void.class == paramType || CharSequence.class.isAssignableFrom(paramType));
  }
  
  ```

- ViewNameMethodReturnValueHandler#handleReturnValue：

  ```java
  public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                                ModelAndViewContainer mavContainer, 
                                NativeWebRequest webRequest) throws Exception {
  	// 返回值是字符串，是 return "forward:/success"
      if (returnValue instanceof CharSequence) {
          String viewName = returnValue.toString();
          // 【把视图名称设置进入 ModelAndViewContainer 中】
          mavContainer.setViewName(viewName);
          // 判断是否是重定向数据 `viewName.startsWith("redirect:")`
          if (isRedirectViewName(viewName)) {
              // 如果是重定向，设置是重定向指令
              mavContainer.setRedirectModelScenario(true);
          }
      }
      else if (returnValue != null) {
          // should not happen
          throw new UnsupportedOperationException();
      }
  }
  
  ```

  



------



#### 结果派发

doDispatch() 中的 processDispatchResult：处理派发结果

```java
private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
                                   @Nullable HandlerExecutionChain mappedHandler, 
                                   @Nullable ModelAndView mv,
                                   @Nullable Exception exception) throws Exception {
    boolean errorView = false;
    if (exception != null) {
    }
    // mv 是 ModelAndValue
    if (mv != null && !mv.wasCleared()) {
        // 渲染视图
        render(mv, request, response);
        if (errorView) {
            WebUtils.clearErrorRequestAttributes(request);
        }
    }
    else {}  
}

```

DispatcherServlet#render：

- `Locale locale = this.localeResolver.resolveLocale(request)`：国际化相关

- `String viewName = mv.getViewName()`：视图名字，是请求转发 forward:/success（响应数据解析并存入 ModelAndView）

- `view = resolveViewName(viewName, mv.getModelInternal(), locale, request)`：解析视图

  - `for (ViewResolver viewResolver : this.viewResolvers)`：**遍历所有的视图解析器**

    `view = viewResolver.resolveViewName(viewName, locale)`：根据视图名字解析视图，调用内容协商视图处理器 ContentNegotiatingViewResolver 的方法

    - `attrs = RequestContextHolder.getRequestAttributes()`：获取请求的相关属性信息

    - `requestedMediaTypes = getMediaTypes(((ServletRequestAttributes) attrs).getRequest())`：获取最佳匹配的媒体类型，函数内进行了匹配的逻辑

    - `candidateViews = getCandidateViews(viewName, locale, requestedMediaTypes)`：获取候选的视图对象

      - `for (ViewResolver viewResolver : this.viewResolvers)`：遍历所有的视图解析器

      - `View view = viewResolver.resolveViewName(viewName, locale)`：**解析视图**

        `AbstractCachingViewResolver#resolveViewName`：

        - `returnview = createView(viewName, locale)`：UrlBasedViewResolver#createView

          **请求转发**：实例为 InternalResourceView

          - `if (viewName.startsWith(FORWARD_URL_PREFIX))`：视图名字是否是 **`forward:`** 的前缀
          - `forwardUrl = viewName.substring(FORWARD_URL_PREFIX.length())`：名字截取前缀
          - `view = new InternalResourceView(forwardUrl)`：新建 InternalResourceView  对象并返回
          - `return applyLifecycleMethods(FORWARD_URL_PREFIX, view)`：Spring 中的初始化操作

          **重定向**：实例为 RedirectView 

          - `if (viewName.startsWith(REDIRECT_URL_PREFIX))`：视图名字是否是 **`redirect:`** 的前缀
          - `redirectUrl = viewName.substring(REDIRECT_URL_PREFIX.length())`：名字截取前缀
          - `RedirectView view = new RedirectView()`：新建 RedirectView 对象并返回

    - `bestView = getBestView(candidateViews, requestedMediaTypes, attrs)`：选出最佳匹配的视图对象

- `view.render(mv.getModelInternal(), request, response)`：**页面渲染**

  - `mergedModel = createMergedOutputModel(model, request, response)`：把请求域中的数据封装到 model

  - `prepareResponse(request, response)`：响应前的准备工作，设置一些响应头

  - `renderMergedOutputModel(mergedModel, getRequestToExpose(request), response)`：渲染输出的数据

    `getRequestToExpose(request)`：获取 Servlet 原生的方式

    **请求转发 InternalResourceView 的逻辑：请求域中的数据不丢失**

    - `exposeModelAsRequestAttributes(model, request)`：暴露 model 作为请求域的属性
      - `model.forEach()`：遍历 Model 中的数据
      - `request.setAttribute(name, value)`：**设置到请求域中**
    - `exposeHelpers(request)`：自定义接口
    - `dispatcherPath = prepareForRendering(request, response)`：确定调度分派的路径，此例是 /success
    - `rd = getRequestDispatcher(request, dispatcherPath)`：**获取 Servlet 原生的 RequestDispatcher 实现转发**
    - `rd.forward(request, response)`：实现请求转发

    **重定向 RedirectView 的逻辑：请求域中的数据会丢失**

    - `targetUrl = createTargetUrl(model, request)`：获取目标 URL
      - `enc = request.getCharacterEncoding()`：设置编码 UTF-8
      - `appendQueryProperties(targetUrl, model, enc)`：添加一些属性，比如 `url + ?name=123&&age=324`
    - `sendRedirect(request, response, targetUrl, this.http10Compatible)`：重定向
      - `response.sendRedirect(encodedURL)`：**使用 Servlet 原生方法实现重定向**





------





## 异步调用

### 请求参数

名称：@RequestBody

类型：形参注解

位置：处理器类中的方法形参前方

作用：将异步提交数据**转换**成标准请求参数格式，并赋值给形参
范例：

```java
@Controller //控制层
public class AjaxController {
    @RequestMapping("/ajaxController")
    public String ajaxController(@RequestBody String message){
        System.out.println(message);
        return "page.jsp";
    }  
}

```

- 注解添加到 POJO  参数前方时，封装的异步提交数据按照 POJO  的属性格式进行关系映射
  - POJO 中的属性如果请求数据中没有，属性值为 null
  - POJO 中没有的属性如果请求数据中有，不进行映射
- 注解添加到集合参数前方时，封装的异步提交数据按照集合的存储结构进行关系映射 

```java
@RequestMapping("/ajaxPojoToController")
//如果处理参数是POJO，且页面发送的请求数据格式与POJO中的属性对应，@RequestBody注解可以自动映射对应请求数据到POJO中
public String  ajaxPojoToController(@RequestBody User user){
    System.out.println("controller pojo :"+user);
    return "page.jsp";
}

@RequestMapping("/ajaxListToController")
//如果处理参数是List集合且封装了POJO，且页面发送的数据是JSON格式，数据将自动映射到集合参数
public String  ajaxListToController(@RequestBody List<User> userList){
    System.out.println("controller list :"+userList);
    return "page.jsp";
}

```

ajax.jsp

```html
<%@page pageEncoding="UTF-8" language="java" contentType="text/html;UTF-8" %>

<a href="javascript:void(0);" id="testAjax">访问springmvc后台controller</a><br/>
<a href="javascript:void(0);" id="testAjaxPojo">传递Json格式POJO</a><br/>
<a href="javascript:void(0);" id="testAjaxList">传递Json格式List</a><br/>
    
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript">
    $(function () {
        //为id="testAjax"的组件绑定点击事件
        $("#testAjax").click(function(){
            //发送异步调用
            $.ajax({
               //请求方式：POST请求
               type:"POST",
               //请求的地址
               url:"ajaxController",
               //请求参数（也就是请求内容）
               data:'ajax message',
               //响应正文类型
               dataType:"text",
               //请求正文的MIME类型
               contentType:"application/text",
            });
        });
        
         //为id="testAjaxPojo"的组件绑定点击事件
        $("#testAjaxPojo").click(function(){
            $.ajax({
               type:"POST",
               url:"ajaxPojoToController",
               data:'{"name":"Jock","age":39}',
               dataType:"text",
               contentType:"application/json",
            });
        });
        
        //为id="testAjaxList"的组件绑定点击事件
        $("#testAjaxList").click(function(){
            $.ajax({//.....
               data:'[{"name":"Jock","age":39},{"name":"Jockme","age":40}]'})}
    }
</script>

```

web.xml配置：请求响应章节请求中的web.xml配置

```xml
CharacterEncodingFilter + DispatcherServlet

```

spring-mvc.xml：

```xml
<context:component-scan base-package="controller,domain"/>
<mvc:resources mapping="/js/**" location="/js/"/>
<mvc:annotation-driven/>

```



------



### 响应数据

注解：@ResponseBody

作用：将 Java 对象转为 json 格式的数据

方法返回值为 POJO 时，自动封装数据成 Json 对象数据：

```java
@RequestMapping("/ajaxReturnJson")
@ResponseBody
public User ajaxReturnJson(){
    System.out.println("controller return json pojo...");
    User user = new User("Jockme",40);
    return user;
}  

```

方法返回值为 List 时，自动封装数据成 json 对象数组数据：

```java
@RequestMapping("/ajaxReturnJsonList")
@ResponseBody
//基于jackon技术，使用@ResponseBody注解可以将返回的保存POJO对象的集合转成json数组格式数据
public List ajaxReturnJsonList(){
    System.out.println("controller return json list...");
    User user1 = new User("Tom",3);
    User user2 = new User("Jerry",5);

    ArrayList al = new ArrayList();
    al.add(user1);
    al.add(user2);
    return al;
}

```

AJAX 文件：

```js
//为id="testAjaxReturnString"的组件绑定点击事件
$("#testAjaxReturnString").click(function(){
    //发送异步调用
    $.ajax({
        type:"POST",
        url:"ajaxReturnString",
        //回调函数
        success:function(data){
            //打印返回结果
            alert(data);
        }
    });
});

//为id="testAjaxReturnJson"的组件绑定点击事件
$("#testAjaxReturnJson").click(function(){
    $.ajax({
        type:"POST",
        url:"ajaxReturnJson",
        success:function(data){
            alert(data['name']+" ,  "+data['age']);
        }
    });
});

//为id="testAjaxReturnJsonList"的组件绑定点击事件
$("#testAjaxReturnJsonList").click(function(){
    $.ajax({
        type:"POST",
        url:"ajaxReturnJsonList",
        success:function(data){
            alert(data);
            alert(data[0]["name"]);
            alert(data[1]["age"]);
        }
    });
});

```



------



### 跨域访问

跨域访问：当通过域名 A 下的操作访问域名 B 下的资源时，称为跨域访问，跨域访问时，会出现无法访问的现象

环境搭建：

- 为当前主机添加备用域名
  - 修改 windows 安装目录中的 host 文件
  - 格式： ip 域名
- 动态刷新 DNS
  - 命令： ipconfig /displaydns
  - 命令： ipconfig /flushdns   

跨域访问支持：

- 名称：@CrossOrigin
- 类型：方法注解 、 类注解
- 位置：处理器类中的方法上方或类上方
- 作用：设置当前处理器方法 / 处理器类中所有方法支持跨域访问
- 范例：  

```java
@RequestMapping("/cross")
@ResponseBody
//使用@CrossOrigin开启跨域访问
//标注在处理器方法上方表示该方法支持跨域访问
//标注在处理器类上方表示该处理器类中的所有处理器方法均支持跨域访问
@CrossOrigin
public User cross(HttpServletRequest request){
    System.out.println("controller cross..." + request.getRequestURL());
    User user = new User("Jockme",36);
    return user;
}

```

- jsp 文件

```html
<a href="javascript:void(0);" id="testCross">跨域访问</a><br/>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript">
    $(function () {
        //为id="testCross"的组件绑定点击事件
        $("#testCross").click(function(){
            //发送异步调用
            $.ajax({
               type:"POST",
               url:"http://127.0.0.1/cross",
               //回调函数
               success:function(data){
                   alert("跨域调用信息反馈:" + data['name'] + "," + data['age']);
               }
            });
        });
    });
</script>

```





------





## 拦截器

### 基本介绍

拦截器（Interceptor）是一种动态拦截方法调用的机制

作用：

1. 在指定的方法调用前后执行预先设定后的的代码
2. 阻止原始方法的执行

核心原理：AOP 思想

拦截器链：多个拦截器按照一定的顺序，对原始被调用功能进行增强  

拦截器和过滤器对比：

1. 归属不同： Filter 属于 Servlet 技术， Interceptor 属于 SpringMVC 技术

2. 拦截内容不同： Filter 对所有访问进行增强， Interceptor 仅针对 SpringMVC 的访问进行增强  

   <img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E8%BF%87%E6%BB%A4%E5%99%A8%E5%92%8C%E6%8B%A6%E6%88%AA%E5%99%A8%E7%9A%84%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6.png" style="zoom:67%;" />



------



### 处理方法

#### 前置处理

原始方法之前运行：

```java
public boolean preHandle(HttpServletRequest request,
                         HttpServletResponse response,
                         Object handler) throws Exception {
    System.out.println("preHandle");
    return true;
}

```

- 参数：
  - request：请求对象
  - response：响应对象
  - handler：被调用的处理器对象，本质上是一个方法对象，对反射中的Method对象进行了再包装
    - handler：public String controller.InterceptorController.handleRun
    - handler.getClass()：org.springframework.web.method.HandlerMethod
- 返回值：
  - 返回值为 false，被拦截的处理器将不执行  



------



#### 后置处理

原始方法运行后运行，如果原始方法被拦截，则不执行：

```java
public void postHandle(HttpServletRequest request,
                       HttpServletResponse response,
                       Object handler,
                       ModelAndView modelAndView) throws Exception {
    System.out.println("postHandle");
}

```

参数：

- modelAndView：如果处理器执行完成具有返回结果，可以读取到对应数据与页面信息，并进行调整  



------



#### 异常处理

拦截器最后执行的方法，无论原始方法是否执行：

```java
public void afterCompletion(HttpServletRequest request,
                            HttpServletResponse response,
                            Object handler,
                            Exception ex) throws Exception {
    System.out.println("afterCompletion");
}

```

参数：

- ex：如果处理器执行过程中出现异常对象，可以针对异常情况进行单独处理  



------



### 拦截配置

拦截路径：

- `/**`：表示拦截所有映射
- `/* `：表示拦截所有/开头的映射
- `/user/*`：表示拦截所有 /user/ 开头的映射
- `/user/add*`：表示拦截所有 /user/ 开头，且具体映射名称以 add 开头的映射
- `/user/*All`：表示拦截所有 /user/ 开头，且具体映射名称以 All 结尾的映射

```xml
<mvc:interceptors>
    <!--开启具体的拦截器的使用，可以配置多个-->
    <mvc:interceptor>
        <!--设置拦截器的拦截路径，支持*通配-->       
        <mvc:mapping path="/handleRun*"/>
        <!--设置拦截排除的路径，配置/**或/*，达到快速配置的目的-->
        <mvc:exclude-mapping path="/b*"/>
        <!--指定具体的拦截器类-->
        <bean class="MyInterceptor"/>
    </mvc:interceptor>
</mvc:interceptors>

```



------



### 拦截器链

**责任链模式**：责任链模式是一种行为模式

特点：沿着一条预先设定的任务链顺序执行，每个节点具有独立的工作任务
优势：

- 独立性：只关注当前节点的任务，对其他任务直接放行到下一节点
- 隔离性：具备链式传递特征，无需知晓整体链路结构，只需等待请求到达后进行处理即可
- 灵活性：可以任意修改链路结构动态新增或删减整体链路责任
- 解耦：将动态任务与原始任务解耦

缺点：

- 链路过长时，处理效率低下
- 可能存在节点上的循环引用现象，造成死循环，导致系统崩溃  

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E5%A4%9A%E6%8B%A6%E6%88%AA%E5%99%A8%E9%85%8D%E7%BD%AE.png" style="zoom:67%;" />



------



### 源码解析

DispatcherServlet#doDispatch 方法中：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
	try {
        // 获取映射器以及映射器的所有拦截器（运行原理部分详解了源码）
        mappedHandler = getHandler(processedRequest);
        // 前置处理，返回 false 代表条件成立
        if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            //请求从这里直接结束
            return;
        }
        //所有拦截器都返回 true，执行目标方法
        mv = ha.handle(processedRequest, response, mappedHandler.getHandler())
        // 倒序执行所有拦截器的后置处理方法
        mappedHandler.applyPostHandle(processedRequest, response, mv);
    } catch (Exception ex) {
        //异常处理机制
        triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
    }
}

```

HandlerExecutionChain#applyPreHandle：前置处理

```java
boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {
    //遍历所有的拦截器
    for (int i = 0; i < this.interceptorList.size(); i++) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        //执行前置处理，如果拦截器返回 false，则条件成立，不在执行其他的拦截器，直接返回 false，请求直接结束
        if (!interceptor.preHandle(request, response, this.handler)) {
            triggerAfterCompletion(request, response, null);
            return false;
        }
        this.interceptorIndex = i;
    }
    return true;
}

```

HandlerExecutionChain#applyPostHandle：后置处理

```java
void applyPostHandle(HttpServletRequest request, HttpServletResponse response, @Nullable ModelAndView mv)
    throws Exception {
	//倒序遍历
    for (int i = this.interceptorList.size() - 1; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        interceptor.postHandle(request, response, this.handler, mv);
    }
}

```

DispatcherServlet#triggerAfterCompletion 底层调用 HandlerExecutionChain#triggerAfterCompletion：

- 前面的步骤有任何异常都会直接倒序触发 afterCompletion
- 页面成功渲染有异常，也会倒序触发 afterCompletion

```java
void triggerAfterCompletion(HttpServletRequest request, HttpServletResponse response, @Nullable Exception ex) {
    //倒序遍历
    for (int i = this.interceptorIndex; i >= 0; i--) {
        HandlerInterceptor interceptor = this.interceptorList.get(i);
        try {
            //执行异常处理的方法
            interceptor.afterCompletion(request, response, this.handler, ex);
        }
        catch (Throwable ex2) {
            logger.error("HandlerInterceptor.afterCompletion threw exception", ex2);
        }
    }
}

```



拦截器的执行流程：

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E6%8B%A6%E6%88%AA%E5%99%A8%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.png" style="zoom: 50%;" />



参考文章：https://www.yuque.com/atguigu/springboot/vgzmgh#wtPLU



------



### 自定义

- Contoller层

  ```java
  @Controller
  public class InterceptorController {
      @RequestMapping("/handleRun")
      public String handleRun() {
          System.out.println("业务处理器运行------------main");
          return "page.jsp";
      }
  }
  
  ```

- 自定义拦截器需要实现 HandleInterceptor 接口

  ```java
  //自定义拦截器需要实现HandleInterceptor接口
  public class MyInterceptor implements HandlerInterceptor {
      //处理器运行之前执行
      @Override
      public boolean preHandle(HttpServletRequest request,
                               HttpServletResponse response,
                               Object handler) throws Exception {
          System.out.println("前置运行----a1");
          //返回值为false将拦截原始处理器的运行
          //如果配置多拦截器，返回值为false将终止当前拦截器后面配置的拦截器的运行
          return true;
      }
  
      //处理器运行之后执行
      @Override
      public void postHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler,
                             ModelAndView modelAndView) throws Exception {
          System.out.println("后置运行----b1");
      }
  
      //所有拦截器的后置执行全部结束后，执行该操作
      @Override
      public void afterCompletion(HttpServletRequest request,
                                  HttpServletResponse response,
                                  Object handler,
                                  Exception ex) throws Exception {
          System.out.println("完成运行----c1");
      }
  }
  
  ```

  说明：三个方法的运行顺序为    preHandle → postHandle → afterCompletion，如果 preHandle 返回值为 false，三个方法仅运行preHandle

- web.xml：

  ```xml
  CharacterEncodingFilter + DispatcherServlet
  
  ```

- 配置拦截器：spring-mvc.xml

  ```xml
  <mvc:annotation-driven/>
  <context:component-scan base-package="interceptor,controller"/>
  <mvc:interceptors>
      <mvc:interceptor>
          <mvc:mapping path="/handleRun"/>
          <bean class="interceptor.MyInterceptor"/>
      </mvc:interceptor>
  </mvc:interceptors>
  
  ```

  注意：配置顺序为**先配置执行位置，后配置执行类**





------





## 异常处理

### 处理器

异常处理器： **HandlerExceptionResolver** 接口

类继承该接口的以后，当开发出现异常后会执行指定的功能

```java
@Component
public class ExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object handler,
                                         Exception ex) {
        System.out.println("异常处理器正在执行中");
        ModelAndView modelAndView = new ModelAndView();
        //定义异常现象出现后，反馈给用户查看的信息
        modelAndView.addObject("msg","出错啦！ ");
        //定义异常现象出现后，反馈给用户查看的页面
        modelAndView.setViewName("error.jsp");
        return modelAndView;
    }
}

```

根据异常的种类不同，进行分门别类的管理，返回不同的信息：

```java
public class ExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object handler,
                                         Exception ex) {
        System.out.println("my exception is running ...." + ex);
        ModelAndView modelAndView = new ModelAndView();
        if( ex instanceof NullPointerException){
            modelAndView.addObject("msg","空指针异常");
        }else if ( ex instanceof  ArithmeticException){
            modelAndView.addObject("msg","算数运算异常");
        }else{
            modelAndView.addObject("msg","未知的异常");
        }
        modelAndView.setViewName("error.jsp");
        return modelAndView;
    }
}

```

模拟错误：

```java
@Controller
public class UserController {
    @RequestMapping("/save")
    @ResponseBody
    public String save(@RequestBody String name) {
        //模拟业务层发起调用产生了异常
//        int i = 1/0;
//        String str = null;
//        str.length();

        return "error.jsp";
    }

```



------



### 注解开发

使用注解实现异常分类管理，开发异常处理器

@ControllerAdvice 注解：

- 类型：类注解

- 位置：异常处理器类上方

- 作用：设置当前类为异常处理器类

- 格式：

  ```java
  @Component
  //声明该类是一个Controller的通知类，声明后该类就会被加载成异常处理器
  @ControllerAdvice
  public class ExceptionAdvice {
  }  
  
  ```

@ExceptionHandler 注解：

- 类型：方法注解

- 位置：异常处理器类中针对指定异常进行处理的方法上方

- 作用：设置指定异常的处理方式

- 说明：处理器方法可以设定多个

- 格式：

  ```java
  @Component
  @ControllerAdvice
  public class ExceptionAdvice {
      //类中定义的方法携带@ExceptionHandler注解的会被作为异常处理器，后面添加实际处理的异常类型
      @ExceptionHandler(NullPointerException.class)
      @ResponseBody
      public String doNullException(Exception ex){
          return "空指针异常";
      }
  
      @ExceptionHandler(Exception.class)
      @ResponseBody
      public String doException(Exception ex){
          return "all Exception";
      }
  }
  
  ```

@ResponseStatus 注解：

- 类型：类注解、方法注解

- 位置：异常处理器类、方法上方

- 参数：

  value：出现错误指定返回状态码

  reason：出现错误返回的错误信息





------



### 解决方案

- web.xml

  ```java
  DispatcherServlet + CharacterEncodingFilter
  
  ```

- ajax.jsp

  ```jsp
  <%@page pageEncoding="UTF-8" language="java" contentType="text/html;UTF-8" %>
  
  <a href="javascript:void(0);" id="testException">点击</a><br/>
  
  <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-3.3.1.min.js"></script>
  <script type="text/javascript">
      $(function () {
          $("#testException").click(function(){
              $.ajax({
                  contentType:"application/json",
                  type:"POST",
                  url:"save",
                  /*通过修改参数，激活自定义异常的出现*/
                  // name长度低于8位出现业务异常
                  // age小于0出现业务异常
                  // age大于100出现系统异常
                  // age类型如果无法匹配将转入其他类别异常
                  data:'{"name":"JockSuperMan","age":"-1"}',
                  dataType:"text",
                  //回调函数
                  success:function(data){
                      alert(data);
                  }
              });
          });
      });
  </script>
  
  ```

- spring-mvc.xml

  ```xml
  <mvc:annotation-driven/>
  <context:component-scan base-package="com.seazean"/>
  <mvc:resources mapping="/js/**" location="/js/"/>
  
  ```

- java / controller / UserController

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/save")
      @ResponseBody
      public List<User> save(@RequestBody User user) {
          System.out.println("user controller save is running ...");
          //对用户的非法操作进行判定，并包装成异常对象进行处理，便于统一管理
          if(user.getName().trim().length() < 8){
              throw new BusinessException("对不起，用户名长度不满足要求，请重新输入！");
          }
          if(user.getAge() < 0){
              throw new BusinessException("对不起，年龄必须是0到100之间的数字！");
          }
          if(user.getAge() > 100){
              throw new SystemException("服务器连接失败，请尽快检查处理！");
          }
  
          User u1 = new User("Tom",3);
          User u2 = new User("Jerry",5);
          ArrayList<User> al = new ArrayList<User>();
          al.add(u1);al.add(u2);
          return al;
      }
  }
  
  ```

- 自定义异常

  ```java
  //自定义异常继承RuntimeException，覆盖父类所有的构造方法
  public class BusinessException extends RuntimeException {覆盖父类所有的构造方法}
  
  ```

  ```java
  public class SystemException extends RuntimeException {}
  
  ```

- 通过自定义异常将所有的异常现象进行分类管理，以统一的格式对外呈现异常消息

  ```java
  @Component
  @ControllerAdvice
  public class ProjectExceptionAdvice {
      @ExceptionHandler(BusinessException.class)
      public String doBusinessException(Exception ex, Model m){
          //使用参数Model将要保存的数据传递到页面上，功能等同于ModelAndView
          //业务异常出现的消息要发送给用户查看
          m.addAttribute("msg",ex.getMessage());
          return "error.jsp";
      }
  
      @ExceptionHandler(SystemException.class)
      public String doSystemException(Exception ex, Model m){
          //系统异常出现的消息不要发送给用户查看，发送统一的信息给用户看
          m.addAttribute("msg","服务器出现问题，请联系管理员！");
          return "error.jsp";
      }
  
      @ExceptionHandler(Exception.class)
      public String doException(Exception ex, Model m){
          m.addAttribute("msg",ex.getMessage());
          //将ex对象保存起来
          return "error.jsp";
      }
  
  }
  
  ```

  



------





## 文件传输

### 上传下载

上传文件过程：

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%E8%BF%87%E7%A8%8B%E5%88%86%E6%9E%90.png)



MultipartResolver接口：

- MultipartResolver 接口定义了文件上传过程中的相关操作，并对通用性操作进行了封装
- MultipartResolver 接口底层实现类 CommonsMultipartResovler
- CommonsMultipartResovler 并未自主实现文件上传下载对应的功能，而是调用了 apache 文件上传下载组件  

文件上传下载实现：

- 导入坐标

  ```xml
  <dependency>
      <groupId>commons-fileupload</groupId>
      <artifactId>commons-fileupload</artifactId>
      <version>1.4</version>
  </dependency>
  
  ```

- 页面表单 fileupload.jsp

  ```html
  <form method="post" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file"><br>
      <input type="submit" value="提交">
  </form>
  
  ```

- web.xml

  ```xml
  DispatcherServlet + CharacterEncodingFilter
  
  ```

- 控制器

  ```java
  @PostMapping("/upload")
  public String upload(@RequestParam("email") String email,
                       @RequestParam("username") String username,
                       @RequestPart("headerImg") MultipartFile headerImg) throws IOException {
  
      if(!headerImg.isEmpty()){
          //保存到文件服务器，OSS服务器
          String originalFilename = headerImg.getOriginalFilename();
          headerImg.transferTo(new File("H:\\cache\\" + originalFilename));
      }
      return "main";
  }
  
  ```





------



### 名称问题

MultipartFile 参数中封装了上传的文件的相关信息。

1. 文件命名问题， 获取上传文件名，并解析文件名与扩展名

   ```java
   file.getOriginalFilename();
   
   ```

2. 文件名过长问题

3. 文件保存路径

   ```java
   ServletContext context = request.getServletContext();
   String realPath = context.getRealPath("/uploads");
   File file = new File(realPath + "/");
   if(!file.exists()) file.mkdirs();
   
   ```

4. 重名问题

   ```java
   String uuid = UUID.randomUUID.toString().replace("-", "").toUpperCase();
   
   ```

```java
@Controller
public class FileUploadController {
    @RequestMapping(value = "/fileupload")
	//参数中定义MultipartFile参数，用于接收页面提交的type=file类型的表单，表单名称与参数名相同
    public String fileupload(MultipartFile file,MultipartFile file1,MultipartFile file2, HttpServletRequest request) throws IOException {
        System.out.println("file upload is running ..."+file);
//        MultipartFile参数中封装了上传的文件的相关信息
//        System.out.println(file.getSize());
//        System.out.println(file.getBytes().length);
//        System.out.println(file.getContentType());
//        System.out.println(file.getName());
//        System.out.println(file.getOriginalFilename());
//        System.out.println(file.isEmpty());
        //首先判断是否是空文件，也就是存储空间占用为0的文件
        if(!file.isEmpty()){
            //如果大小在范围要求内正常处理，否则抛出自定义异常告知用户（未实现）
            //获取原始上传的文件名，可以作为当前文件的真实名称保存到数据库中备用
            String fileName = file.getOriginalFilename();
            //设置保存的路径
            String realPath = request.getServletContext().getRealPath("/images");
            //保存文件的方法，通常文件名使用随机生成策略产生，避免文件名冲突问题
            file.transferTo(new File(realPath,file.getOriginalFilename()));
        }
        //测试一次性上传多个文件
        if(!file1.isEmpty()){
            String fileName = file1.getOriginalFilename();
            //可以根据需要，对不同种类的文件做不同的存储路径的区分，修改对应的保存位置即可
            String realPath = request.getServletContext().getRealPath("/images");
            file1.transferTo(new File(realPath,file1.getOriginalFilename()));
        }
        if(!file2.isEmpty()){
            String fileName = file2.getOriginalFilename();
            String realPath = request.getServletContext().getRealPath("/images");
            file2.transferTo(new File(realPath,file2.getOriginalFilename()));
        }
        return "page.jsp";
    }
}

```



------



### 源码解析

StandardServletMultipartResolver 是文件上传解析器

DispatcherServlet#doDispatch：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // 判断当前请求是不是文件上传请求
    processedRequest = checkMultipart(request);
    // 文件上传请求会对 request 进行包装，导致两者不相等，此处赋值为 true，代表已经被解析
    multipartRequestParsed = (processedRequest != request);
}

```

DispatcherServlet#checkMultipart：

- `if (this.multipartResolver != null && this.multipartResolver.isMultipart(request))`：判断是否是文件请求
  - `StandardServletMultipartResolver#isMultipart`：根据开头是否符合 multipart/form-data 或者 multipart/
- `return this.multipartResolver.resolveMultipart(request)`：把请求封装成 StandardMultipartHttpServletRequest 对象

开始执行 ha.handle() 目标方法进行数据的解析

- RequestPartMethodArgumentResolver#supportsParameter：支持解析文件上传数据

  ```java
  public boolean supportsParameter(MethodParameter parameter) {
      // 参数上有 @RequestPart 注解
      if (parameter.hasParameterAnnotation(RequestPart.class)) {
          return true;
      }
  }
  ```

- RequestPartMethodArgumentResolver#resolveArgument：解析参数数据，封装成 MultipartFile 对象

  - `RequestPart requestPart = parameter.getParameterAnnotation(RequestPart.class)`：获取注解的相关信息
  - `String name = getPartName(parameter, requestPart)`：获取上传文件的名字
  - `Object mpArg = MultipartResolutionDelegate.resolveMultipartArgument()`：解析参数
    - `List<MultipartFile> files = multipartRequest.getFiles(name)`：获取文件的所有数据

- `return doInvoke(args)`：解析完成执行自定义的方法，完成上传功能



------

## SSM整合

前面我们已经把`Mybatis`、`Spring`和`SpringMVC`三个框架进行了学习，今天主要的内容就是把这三个框架整合在一起完成我们的业务功能开发，具体如何来整合，我们一步步来学习。

### 流程分析

(1) 创建工程

- 创建一个Maven的web工程
- pom.xml添加SSM需要的依赖jar包
- 编写Web项目的入口配置类，实现`AbstractAnnotationConfigDispatcherServletInitializer`重写以下方法
  - getRootConfigClasses()	：返回Spring的配置类->需要==SpringConfig==配置类
  - getServletConfigClasses() ：返回SpringMVC的配置类->需要==SpringMvcConfig==配置类
  - getServletMappings()      : 设置SpringMVC请求拦截路径规则
  - getServletFilters()       ：设置过滤器，解决POST请求中文乱码问题

(2)SSM整合[==重点是各个配置的编写==]

- SpringConfig
  - 标识该类为配置类 @Configuration
  - 扫描Service所在的包 @ComponentScan
  - 在Service层要管理事务 @EnableTransactionManagement
  - 读取外部的properties配置文件 @PropertySource
  - 整合Mybatis需要引入Mybatis相关配置类 @Import
    - 第三方数据源配置类 JdbcConfig
      - 构建DataSource数据源，DruidDataSouroce,需要注入数据库连接四要素， @Bean @Value
      - 构建平台事务管理器，DataSourceTransactionManager,@Bean
    - Mybatis配置类 MybatisConfig
      - 构建SqlSessionFactoryBean并设置别名扫描与数据源，@Bean
      - 构建MapperScannerConfigurer并设置DAO层的包扫描
- SpringMvcConfig
  - 标识该类为配置类 @Configuration
  - 扫描Controller所在的包 @ComponentScan
  - 开启SpringMVC注解支持 @EnableWebMvc

(3)功能模块[与具体的业务模块有关]

- 创建数据库表
- 根据数据库表创建对应的模型类
- 通过Dao层完成数据库表的增删改查(接口+自动代理)
- 编写Service层[Service接口+实现类]
  - @Service
  - @Transactional
  - 整合Junit对业务层进行单元测试
    - @RunWith
    - @ContextConfiguration
    - @Test
- 编写Controller层
  - 接收请求 @RequestMapping @GetMapping @PostMapping @PutMapping @DeleteMapping
  - 接收数据 简单、POJO、嵌套POJO、集合、数组、JSON数据类型
    - @RequestParam
    - @PathVariable
    - @RequestBody
  - 转发业务层 
    - @Autowired
  - 响应结果
    - @ResponseBody

### 整合配置

掌握上述的知识点后，接下来，我们就可以按照上述的步骤一步步的来完成SSM的整合。

#### 步骤1：创建Maven的web项目

可以使用Maven的骨架创建

![1630561266760](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630561266760.png)

#### 步骤2:添加依赖

pom.xml添加SSM所需要的依赖jar包

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.itheima</groupId>
  <artifactId>springmvc_08_ssm</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>

    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.6</version>
    </dependency>

    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>1.3.0</version>
    </dependency>

    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.47</version>
    </dependency>

    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.16</version>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>

    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.9.0</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port>
          <path>/</path>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>


```

#### 步骤3:创建项目包结构

![1630561591931](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630561591931.png)

- config目录存放的是相关的配置类
- controller编写的是Controller类
- dao存放的是Dao接口，因为使用的是Mapper接口代理方式，所以没有实现类包
- service存的是Service接口，impl存放的是Service实现类
- resources:存入的是配置文件，如Jdbc.properties
- webapp:目录可以存放静态资源
- test/java:存放的是测试类

#### 步骤4:创建SpringConfig配置类

```java
@Configuration
@ComponentScan({"com.itheima.service"})
@PropertySource("classpath:jdbc.properties")
@Import({JdbcConfig.class,MyBatisConfig.class})
@EnableTransactionManagement
public class SpringConfig {
}
```

xml形式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:mvc="http://www.alibaba.com/schema/stat"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.alibaba.com/schema/stat http://www.alibaba.com/schema/stat.xsd">

<!--    添加包扫描-->
    <context:component-scan base-package="com.chen.controller"></context:component-scan>
<!--    添加注解驱动-->
    <mvc:annotation-driven/>
<!--    因为本项目全部都是ajax请求,不需要配置视图解析器-->
    
</beans>
```



#### 步骤5:创建JdbcConfig配置类

```java
public class JdbcConfig {
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String username;
    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource(){
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driver);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource){
        DataSourceTransactionManager ds = new DataSourceTransactionManager();
        ds.setDataSource(dataSource);
        return ds;
    }
}
```

xml形式：

jdbc.properties

```properties
jdbc.driverClassName=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/ssmuser?useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```



#### 步骤6:创建MybatisConfig配置类

```java
public class MyBatisConfig {
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource){
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setTypeAliasesPackage("com.itheima.domain");
        return factoryBean;
    }

    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){
        MapperScannerConfigurer msc = new MapperScannerConfigurer();
        msc.setBasePackage("com.itheima.dao");
        return msc;
    }
}
```

#### 步骤7:创建jdbc.properties

在resources下提供jdbc.properties,设置数据库连接四要素

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/ssm_db
jdbc.username=root
jdbc.password=root
```

#### 步骤8:创建SpringMVC配置类

```java
@Configuration
@ComponentScan("com.itheima.controller")
@EnableWebMvc
public class SpringMvcConfig {
}
```

#### 步骤9:创建Web项目入口配置类

```java
public class ServletConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    //加载Spring配置类
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }
    //加载SpringMVC配置类
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }
    //设置SpringMVC请求地址拦截规则
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
    //设置post请求中文乱码过滤器
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("utf-8");
        return new Filter[]{filter};
    }
}

```

至此SSM整合的环境就已经搭建好了。在这个环境上，我们如何进行功能模块的开发呢?

### 功能模块开发

> 需求:对表tbl_book进行新增、修改、删除、根据ID查询和查询所有

#### 步骤1:创建数据库及表

```sql
create database ssm_db character set utf8;
use ssm_db;
create table tbl_book(
  id int primary key auto_increment,
  type varchar(20),
  name varchar(50),
  description varchar(255)
)

insert  into `tbl_book`(`id`,`type`,`name`,`description`) values (1,'计算机理论','Spring实战 第五版','Spring入门经典教程，深入理解Spring原理技术内幕'),(2,'计算机理论','Spring 5核心原理与30个类手写实践','十年沉淀之作，手写Spring精华思想'),(3,'计算机理论','Spring 5设计模式','深入Spring源码刨析Spring源码中蕴含的10大设计模式'),(4,'计算机理论','Spring MVC+Mybatis开发从入门到项目实战','全方位解析面向Web应用的轻量级框架，带你成为Spring MVC开发高手'),(5,'计算机理论','轻量级Java Web企业应用实战','源码级刨析Spring框架，适合已掌握Java基础的读者'),(6,'计算机理论','Java核心技术 卷Ⅰ 基础知识(原书第11版)','Core Java第11版，Jolt大奖获奖作品，针对Java SE9、10、11全面更新'),(7,'计算机理论','深入理解Java虚拟机','5个纬度全面刨析JVM,大厂面试知识点全覆盖'),(8,'计算机理论','Java编程思想(第4版)','Java学习必读经典，殿堂级著作！赢得了全球程序员的广泛赞誉'),(9,'计算机理论','零基础学Java(全彩版)','零基础自学编程的入门图书，由浅入深，详解Java语言的编程思想和核心技术'),(10,'市场营销','直播就这么做:主播高效沟通实战指南','李子柒、李佳奇、薇娅成长为网红的秘密都在书中'),(11,'市场营销','直播销讲实战一本通','和秋叶一起学系列网络营销书籍'),(12,'市场营销','直播带货:淘宝、天猫直播从新手到高手','一本教你如何玩转直播的书，10堂课轻松实现带货月入3W+');
```

#### 步骤2:编写模型类

```java
public class Book {
    private Integer id;
    private String type;
    private String name;
    private String description;
    //getter...setter...toString省略
}
```

#### 步骤3:编写Dao接口

```java
public interface BookDao {

//    @Insert("insert into tbl_book values(null,#{type},#{name},#{description})")
    @Insert("insert into tbl_book (type,name,description) values(#{type},#{name},#{description})")
    public void save(Book book);

    @Update("update tbl_book set type = #{type}, name = #{name}, description = #{description} where id = #{id}")
    public void update(Book book);

    @Delete("delete from tbl_book where id = #{id}")
    public void delete(Integer id);

    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);

    @Select("select * from tbl_book")
    public List<Book> getAll();
}
```

#### 步骤4:编写Service接口和实现类

```java
@Transactional
public interface BookService {
    /**
     * 保存
     * @param book
     * @return
     */
    public boolean save(Book book);

    /**
     * 修改
     * @param book
     * @return
     */
    public boolean update(Book book);

    /**
     * 按id删除
     * @param id
     * @return
     */
    public boolean delete(Integer id);

    /**
     * 按id查询
     * @param id
     * @return
     */
    public Book getById(Integer id);

    /**
     * 查询全部
     * @return
     */
    public List<Book> getAll();
}
```

```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;

    public boolean save(Book book) {
        bookDao.save(book);
        return true;
    }

    public boolean update(Book book) {
        bookDao.update(book);
        return true;
    }

    public boolean delete(Integer id) {
        bookDao.delete(id);
        return true;
    }

    public Book getById(Integer id) {
        return bookDao.getById(id);
    }

    public List<Book> getAll() {
        return bookDao.getAll();
    }
}
```

**说明:**

- bookDao在Service中注入的会提示一个红线提示，为什么呢?

  - BookDao是一个接口，没有实现类，接口是不能创建对象的，所以最终注入的应该是代理对象
  - 代理对象是由Spring的IOC容器来创建管理的
  - IOC容器又是在Web服务器启动的时候才会创建
  - IDEA在检测依赖关系的时候，没有找到适合的类注入，所以会提示错误提示
  - 但是程序运行的时候，代理对象就会被创建，框架会使用DI进行注入，所以程序运行无影响。

- 如何解决上述问题?

  - 可以不用理会，因为运行是正常的

  - 设置错误提示级别

    ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630600227357.png)



#### 步骤5:编写Contorller类

```java
//如果本类中全部都是Ajax请求，使用此注解，方法上的@Request Body可不用写
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public boolean save(@RequestBody Book book) {
        return bookService.save(book);
    }

    @PutMapping
    public boolean update(@RequestBody Book book) {
        return bookService.update(book);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return bookService.delete(id);
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Integer id) {
        return bookService.getById(id);
    }

    @GetMapping
    public List<Book> getAll() {
        return bookService.getAll();
    }
}
```

对于图书模块的增删改查就已经完成了编写，我们可以从后往前写也可以从前往后写，最终只需要能把功能实现即可。

接下来我们就先把业务层的代码使用`Spring整合Junit`的知识点进行单元测试:

### 单元测试

#### 步骤1:新建测试类

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class BookServiceTest {

}
```

#### 步骤2:注入Service类

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class BookServiceTest {

    @Autowired
    private BookService bookService;


}
```

#### 步骤3:编写测试方法

我们先来对查询进行单元测试。

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class BookServiceTest {

    @Autowired
    private BookService bookService;

    @Test
    public void testGetById(){
        Book book = bookService.getById(1);
        System.out.println(book);
    }

    @Test
    public void testGetAll(){
        List<Book> all = bookService.getAll();
        System.out.println(all);
    }

}
```

根据ID查询，测试的结果为:

![1630600844191](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630600844191.png)

查询所有，测试的结果为:

![1630600927486](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630600927486.png)

### PostMan测试

#### 新增

`http://localhost/books`

```json
{
	"type":"类别测试数据",
    "name":"书名测试数据",
    "description":"描述测试数据"
}
```

![1630652582425](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630652582425.png)

#### 修改

`http://localhost/books`

```json
{
    "id":13,
	"type":"类别测试数据",
    "name":"书名测试数据",
    "description":"描述测试数据"
}
```

![1630652758221](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630652758221.png)

#### 删除

`http://localhost/books/14`

![1630652796605](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630652796605.png)

#### 查询单个

`http://localhost/books/1`

![1630652837682](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630652837682.png)

#### 查询所有

`http://localhost/books`

![1630652867493](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/1630652867493.png)







## 实用技术

### 校验框架

#### 校验概述

表单校验保障了数据有效性、安全性  

校验分类：客户端校验和服务端校验

- 格式校验
  - 客户端：使用 js 技术，利用正则表达式校验
  - 服务端：使用校验框架 
- 逻辑校验
  - 客户端：使用ajax发送要校验的数据，在服务端完成逻辑校验，返回校验结果
  - 服务端：接收到完整的请求后，在执行业务操作前，完成逻辑校验

表单校验框架：

- JSR（Java Specification Requests）：Java 规范提案 

- 303：提供bean属性相关校验规则

- JCP（Java Community Process）：Java社区

- Hibernate框架中包含一套独立的校验框架hibernate-validator 

- 导入坐标：

  ```xml
  <!--导入校验的jsr303规范-->
  <dependency>
      <groupId>javax.validation</groupId>
      <artifactId>validation-api</artifactId>
      <version>2.0.1.Final</version>
  </dependency>
  <!--导入校验框架实现技术-->
  <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-validator</artifactId>
      <version>6.1.0.Final</version>
  </dependency>
  
  ```

**注意：**

- tomcat7：搭配 hibernate-validator 版本 5.*.*.Final
- tomcat8.5：搭配 hibernate-validator 版本 6.*.*.Final  

 

------



#### 基本使用

##### 开启校验

名称：@Valid、@Validated

类型：形参注解

位置：处理器类中的实体类类型的方法形参前方

作用：设定对当前实体类类型参数进行校验

范例：  

```java
@RequestMapping(value = "/addemployee")
public String addEmployee(@Valid Employee employee) {
    System.out.println(employee);
}

```



##### 校验规则

名称：@NotNull

类型：属性注解等

位置：实体类属性上方

作用：设定当前属性校验规则

范例：每个校验规则所携带的参数不同，根据校验规则进行相应的调整，具体的校验规则查看对应的校验框架进行获取

```java
public class Employee{
    @NotNull(message = "姓名不能为空")
    private String name;//员工姓名
}  

```



##### 错误信息

```java
@RequestMapping(value = "/addemployee")
//Errors对象用于封装校验结果，如果不满足校验规则，对应的校验结果封装到该对象中，包含校验的属性名和校验不通过返回的消息
public String addEmployee(@Valid Employee employee, Errors errors, Model model){
    System.out.println(employee);
    //判定Errors对象中是否存在未通过校验的字段
    if(errors.hasErrors()){
        for(FieldError error : errors.getFieldErrors()){
        	//将校验结果添加到Model对象中，用于页面显示，返回json数据即可
            model.addAttribute(error.getField(),error.getDefaultMessage());
        }
        //当出现未通过校验的字段时，跳转页面到原始页面，进行数据回显
        return "addemployee.jsp";
    }
    return "success.jsp";
}  

```

通过形参Errors获取校验结果数据，通过Model接口将数据封装后传递到页面显示，页面获取后台封装的校验结果信息  

```html
<form action="/addemployee" method="post">
    员工姓名：<input type="text" name="name"><span style="color:red">${name}</span><br/>
    员工年龄：<input type="text" name="age"><span style="color:red">${age}</span><br/>
    <input type="submit" value="提交">
</form>

```



------



#### 多规则校验

- 同一个属性可以添加多个校验器  

  ```java
  public class Employee{
      @NotBlank(message = "姓名不能为空")
      private String name;//员工姓名
  
      @NotNull(message = "请输入年龄")
      @Max(value = 60,message = "年龄最大值60")
      @Min(value = 18,message = "年龄最小值18")
      private Integer age;//员工年龄
  }
  
  ```

- 三种判定空校验器的区别 
  ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springMVC/SpringMVC-%E4%B8%89%E7%A7%8D%E5%88%A4%E5%AE%9A%E7%A9%BA%E6%A3%80%E9%AA%8C%E5%99%A8%E7%9A%84%E5%8C%BA%E5%88%AB.png)



------



#### 嵌套校验

名称：@Valid

类型：属性注解

位置：实体类中的引用类型属性上方

作用：设定当前应用类型属性中的属性开启校验

范例：

```java
public class Employee {
    //实体类中的引用类型通过标注@Valid注解，设定开启当前引用类型字段中的属性参与校验
    @Valid
    private Address address;
}

```

注意：开启嵌套校验后，被校验对象内部需要添加对应的校验规则  

```java
//嵌套校验的实体中，对每个属性正常添加校验规则即可
public class Address implements Serializable {
    @NotBlank(message = "请输入省份名称")
    private String provinceName;//省份名称

    @NotBlank(message = "请输入邮政编码")
    @Size(max = 6,min = 6,message = "邮政编码由6位组成")
    private String zipCode;//邮政编码
}

```



------



#### 分组校验

分组校验的介绍

- 同一个模块，根据执行的业务不同，需要校验的属性会有不同
  - 新增用户
  - 修改用户
- 对不同种类的属性进行分组，在校验时可以指定参与校验的字段所属的组类别
  - 定义组（通用）
  - 为属性设置所属组，可以设置多个
  - 开启组校验

domain：

```java
//用于设定分组校验中的组名，当前接口仅提供字节码，用于识别
public interface GroupOne {
}

```

```java
public class Employee{
    @NotBlank(message = "姓名不能为空",groups = {GroupA.class})
    private String name;//员工姓名

    @NotNull(message = "请输入年龄",groups = {GroupA.class})
    @Max(value = 60,message = "年龄最大值60")//不加Group的校验不生效
    @Min(value = 18,message = "年龄最小值18")
    private Integer age;//员工年龄

    @Valid
    private Address address;
    //......
}

```

controller：

```java
@Controller
public class EmployeeController {
    @RequestMapping(value = "/addemployee")
    public String addEmployee(@Validated({GroupA.class}) Employee employee, Errors errors, Model m){
        if(errors.hasErrors()){
            List<FieldError> fieldErrors = errors.getFieldErrors();
            System.out.println(fieldErrors.size());
            for(FieldError error : fieldErrors){
                m.addAttribute(error.getField(),error.getDefaultMessage());
            }
            return "addemployee.jsp";
        }
        return "success.jsp";
    }
}

```

jsp：

```html
<form action="/addemployee" method="post"><%--页面使用${}获取后台传递的校验信息--%>
    员工姓名：<input type="text" name="name"><span style="color:red">${name}</span><br/>
    员工年龄：<input type="text" name="age"><span style="color:red">${age}</span><br/>
    <%--注意，引用类型的校验未通过信息不是通过对象进行封装的，直接使用对象名.属性名的格式作为整体属性字符串进行保存的，和使用者的属性传递方式有关，不具有通用性，仅适用于本案例--%>
    省：<input type="text" name="address.provinceName"><span style="color:red">${requestScope['address.provinceName']}</span><br/>
        <input type="submit" value="提交">
/form>

```



------



### Lombok

Lombok 用标签方式代替构造器、getter/setter、toString() 等方法

引入依赖：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>

```

下载插件：IDEA 中 File → Settings → Plugins，搜索安装 Lombok 插件

常用注解：

```java
@NoArgsConstructor		// 无参构造
@AllArgsConstructor		// 全参构造
@Data					// set + get
@ToString				// toString
@EqualsAndHashCode		// hashConde + equals
```

简化日志：

```java
@Slf4j
@RestController
public class HelloController {
    @RequestMapping("/hello")
    public String handle01(@RequestParam("name") String name){
        log.info("请求进来了....");
        return "Hello, Spring!" + "你好：" + name;
    }
}
```







------



