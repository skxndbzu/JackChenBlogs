---
title: SpringBoot
icon: pen-to-square
order: 4
date: 2023-03-11
category:
  - SpringBoot
tag:
  - 自动配置
  - 事件
  - 监听器

---



# SpringBoot

## 基本介绍

### Boot介绍

SpringBoot 提供了一种快速使用 Spring 的方式，基于约定优于配置的思想，可以让开发人员不必在配置与逻辑业务之间进行思维的切换，全身心的投入到逻辑业务的代码编写中，从而大大提高了开发的效率

SpringBoot 功能：

- 自动配置，自动配置是一个运行时（更准确地说，是应用程序启动时）的过程，考虑了众多因素选择使用哪个配置，该过程是SpringBoot 自动完成的
- 起步依赖，起步依赖本质上是一个 Maven 项目对象模型（Project Object Model，POM），定义了对其他库的传递依赖，这些东西加在一起即支持某项功能。简单的说，起步依赖就是将具备某种功能的坐标打包到一起，并提供一些默认的功能
- 辅助功能，提供了一些大型项目中常见的非功能性特性，如内嵌 web 服务器、安全、指标，健康检测、外部配置等



参考视频：https://www.bilibili.com/video/BV19K4y1L7MT



------



### 构建工程

普通构建：

1. 创建 Maven 项目

2. 导入 SpringBoot 起步依赖

   ```xml
   <!--springboot 工程需要继承的父工程-->
   <parent>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-parent</artifactId>
       <version>3.0.5</version>
   </parent>
   
   <dependencies>
       <!--web 开发的起步依赖-->
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
   </dependencies>
   ```

3. 定义 Controller

   ```java
   @RestController
   public class HelloController {
       @RequestMapping("/hello")
       public String hello(){
           return " hello Spring Boot !";
       }
   }
   ```

4. 编写引导类

   ```java
   // 引导类，SpringBoot项目的入口
   @SpringBootApplication
   public class HelloApplication {
       public static void main(String[] args) {
           SpringApplication.run(HelloApplication.class, args);
       }
   }
   ```

5. 测试

默认启动访问： localhost:8080/hello

6. 打包

```xml
<!--    SpringBoot应用打包插件-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

`mvn clean package`把项目打成可执行的jar包

`java -jar demo.jar`启动项目



快速构建：

![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/SpringBoot-IDEA%25E6%259E%2584%25E5%25BB%25BA%25E5%25B7%25A5%25E7%25A8%258B.png)







------





## 自动装配

### 依赖管理

在 spring-boot-starter-parent(spring2以后变成了spring-boot-dependencies) 中定义了各种技术的版本信息，组合了一套最优搭配的技术版本。在各种 starter 中，定义了完成该功能需要的坐标合集，其中大部分版本信息来自于父工程。工程继承 parent，引入 starter 后，通过依赖传递，就可以简单方便获得需要的 jar 包，并且不会存在版本冲突，自动版本仲裁机制

### 自动配置机制

#### 初步理解

- **自动配置**的 Tomcat、SpringMVC 等

- - **导入场景**，容器中就会自动配置好这个场景的核心组件。
  - 以前：DispatcherServlet、ViewResolver、CharacterEncodingFilter....
  - 现在：自动配置好的这些组件
  - 验证：**容器中有了什么组件，就具有什么功能**

```java
    public static void main(String[] args) {

        //java10： 局部变量类型的自动推断
        var ioc = SpringApplication.run(MainApplication.class, args);

        //1、获取容器中所有组件的名字
        String[] names = ioc.getBeanDefinitionNames();
        //2、挨个遍历：
        // dispatcherServlet、beanNameViewResolver、characterEncodingFilter、multipartResolver
        // SpringBoot把以前配置的核心组件现在都给我们自动配置好了。
        for (String name : names) {
            System.out.println(name);
        }

    }
```

- **默认的包扫描规则**

- - `@SpringBootApplication` 标注的类就是主程序类
  - **SpringBoot只会扫描主程序所在的包及其下面的子包，自动的component-scan功能**
  - **自定义扫描路径**

- - - @SpringBootApplication(scanBasePackages = "com.atguigu")
    - `@ComponentScan("com.atguigu")` 直接指定扫描的路径

- **配置默认值**

- - **配置文件**的所有配置项是和某个**类的对象**值进行一一绑定的。
  - 绑定了配置文件中每一项值的类： **属性类**。
  - 比如：

- - - `ServerProperties`绑定了所有Tomcat服务器有关的配置
    - `MultipartProperties`绑定了所有文件上传相关的配置
    - ....参照[官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties.server)：或者参照 绑定的  **属性类**。

- 按需加载自动配置

- - 导入场景`spring-boot-starter-web`
  - 场景启动器除了会导入相关功能依赖，导入一个`spring-boot-starter`，是所有`starter`的`starter`，基础核心starter
  - `spring-boot-starter`导入了一个包 `spring-boot-autoconfigure`。包里面都是各种场景的`AutoConfiguration`**自动配置类**
  - 虽然全场景的自动配置都在 `spring-boot-autoconfigure`这个包，但是不是全都开启的。

- 导入哪个场景就开启哪个自动配置

#### 默认效果

默认配置：

1. 包含了 ContentNegotiatingViewResolver 和 BeanNameViewResolver 组件，**方便视图解析**
2. **默认的静态资源处理机制**： 静态资源放在 static 文件夹下即可直接访问
3. **自动注册**了 **Converter**,GenericConverter,**Formatter**组件，适配常见**数据类型转换**和**格式化需求**
4. **支持** **HttpMessageConverters**，可以**方便返回**json等**数据类型**
5. **注册** MessageCodesResolver，方便**国际化**及错误消息处理
6. **支持 静态** index.html
7. **自动使用**ConfigurableWebBindingInitializer，实现消息处理、数据绑定、类型转化、数据校验等功能

**重要：**

- *如果想保持* **boot mvc 的默认配置**，并且自定义更多的 mvc 配置，如：***interceptors***, **formatters**, **view controllers** *等。可以使用**@Configuration**注解添加一个* *WebMvcConfigurer* *类型的配置类，并不要标注* *@EnableWebMvc*
- *如果想保持 boot mvc 的默认配置，但要自定义核心组件实例，比如：**RequestMappingHandlerMapping**,* *RequestMappingHandlerAdapter*, 或**ExceptionHandlerExceptionResolver**，给容器中放一个 *WebMvcRegistrations* *组件即可*
- *如果想全面接管 Spring MVC，@Configuration* *标注一个配置类，并加上* *@EnableWebMvc注解，实现WebMvcConfigurer *接口*

总结： 导入场景启动器、触发 `spring-boot-autoconfigure`这个包的自动配置生效、容器中就会具有相关场景的功能

#### 完整流程

思考：

**1、SpringBoot怎么实现导一个**`**starter**`**、写一些简单配置，应用就能跑起来，我们无需关心整合**

2、为什么Tomcat的端口号可以配置在`application.properties`中，并且`Tomcat`能启动成功？

3、导入场景后哪些**自动配置能生效**？

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image.png)



***自动配置流程细节梳理：***

**1、**导入`starter-web`：导入了web开发场景

- 1、场景启动器导入了相关场景的所有依赖：`starter-json`、`starter-tomcat`、`springmvc`
- 2、每个场景启动器都引入了一个`spring-boot-starter`，核心场景启动器。
- 3、**核心场景启动器**引入了`spring-boot-autoconfigure`包。
- 4、`spring-boot-autoconfigure`里面囊括了所有场景的所有配置。
- 5、只要这个包下的所有类都能生效，那么相当于SpringBoot官方写好的整合功能就生效了。
- 6、SpringBoot默认却扫描不到 `spring-boot-autoconfigure`下写好的所有**配置类**。（这些**配置类**给我们做了整合操作），**默认只扫描主程序所在的包**。

2、主程序：`@SpringBootApplication`

- 1、`@SpringBootApplication`由三个注解组成`@SpringBootConfiguration`、`@EnableAutoConfiguratio`、`@ComponentScan`
- 2、SpringBoot默认只能扫描自己主程序所在的包及其下面的子包，扫描不到 `spring-boot-autoconfigure`包中官方写好的**配置类**
- 3、`**@EnableAutoConfiguration**`：SpringBoot **开启自动配置的核心**。

- - \1. 是由`@Import(AutoConfigurationImportSelector.class)`提供功能：批量给容器中导入组件。
  - \2. SpringBoot启动会默认加载 142个配置类。
  - \3. 这**142个配置类**来自于`spring-boot-autoconfigure`下 `META-INF/spring/**org.springframework.boot.autoconfigure.AutoConfiguration**.imports`文件指定的
  - 项目启动的时候利用 @Import 批量导入组件机制把 `autoconfigure` 包下的142 `xxxxAutoConfiguration`类导入进来（**自动配置类**）
  - 虽然导入了`142`个自动配置类

- 4、按需生效：

- - 并不是这`142`个自动配置类都能生效
  - 每一个自动配置类，都有条件注解`@ConditionalOnxxx`，只有条件成立，才能生效 

3、**xxxxAutoConfiguration**自动配置类

- **1、给容器中使用@Bean 放一堆组件。**
- 2、每个**自动配置类**都可能有这个注解`@EnableConfigurationProperties(**ServerProperties**.class)`，用来把配置文件中配的指定前缀的属性值封装到 `xxxProperties`**属性类**中
- 3、以Tomcat为例：把服务器的所有配置都是以`server`开头的。配置都封装到了属性类中。
- 4、给**容器**中放的所有**组件**的一些**核心参数**，都来自于`**xxxProperties**`**。**`**xxxProperties**`**都是和配置文件绑定。**
- **只需要改配置文件的值，核心组件的底层参数都能修改**

**4、**写业务，全程无需关心各种整合（底层这些整合写好了，而且也生效了）



**核心流程总结：**

1、导入`starter`，就会导入`autoconfigure`包。

2、`autoconfigure` 包里面 有一个文件 `META-INF/spring/**org.springframework.boot.autoconfigure.AutoConfiguration**.imports`,里面指定的所有启动要加载的自动配置类

3、@EnableAutoConfiguration 会自动的把上面文件里面写的所有**自动配置类都导入进来。xxxAutoConfiguration 是有条件注解进行按需加载**

4、`xxxAutoConfiguration`给容器中导入一堆组件，组件都是从 `xxxProperties`中提取属性值

5、`xxxProperties`又是和**配置文件**进行了绑定



**效果：**导入`starter`、修改配置文件，就能修改底层行为。



------



### 底层注解

#### SpringBoot

@SpringBootApplication：启动注解，实现 SpringBoot 的自动部署

- 参数 scanBasePackages：可以指定扫描范围
- 默认扫描当前引导类所在包及其子包

假如所在包为 com.example.springbootenable，扫描配置包 com.example.config 的信息，三种解决办法：

1. 使用 @ComponentScan 扫描 com.example.config 包
2. 使用 @Import 注解加载类，这些类都会被 Spring 创建并放入 ioc 容器，默认组件的名字就是**全类名**
3. 对 @Import 注解进行封装

```java
//1.@ComponentScan("com.example.config")
//2.@Import(UserConfig.class)
@EnableUser
@SpringBootApplication
public class SpringbootEnableApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SpringbootEnableApplication.class, args);
    	//获取Bean
        Object user = context.getBean("user");
        System.out.println(user);

	}
}
```

UserConfig：

```java
@Configuration
public class UserConfig {
    @Bean
    public User user() {
        return new User();
    }
}
```

EnableUser 注解类：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(UserConfig.class)//@Import注解实现Bean的动态加载
public @interface EnableUser {
}

```



------



#### Configuration

@Configuration：设置当前类为 SpringBoot 的配置类，使用**@SpringBootConfiguration**效果一样

- proxyBeanMethods = true：Full 全模式，每个 @Bean 方法被调用多少次返回的组件都是单实例的，默认值，类组件之间**有依赖关系**，方法会被调用得到之前单实例组件
- proxyBeanMethods = false：Lite 轻量级模式，每个 @Bean 方法被调用多少次返回的组件都是新创建的，类组件之间**无依赖关系**用 Lite 模式加速容器启动过程

```java
@Configuration(proxyBeanMethods = true)
public class MyConfig {
    @Bean //给容器中添加组件。以方法名作为组件的 id。返回类型就是组件类型。返回的值，就是组件在容器中的实例
    public User user(){
        User user = new User("zhangsan", 18);
        return user;
    }
}
```





------



#### Condition

##### 条件注解

如果注解指定的**条件成立**，则触发指定行为

***@ConditionalOnXxx***

**@ConditionalOnClass：如果类路径中存在这个类，则触发指定行为**

**@ConditionalOnMissingClass：如果类路径中不存在这个类，则触发指定行为**

**@ConditionalOnBean：如果容器中存在这个Bean（组件），则触发指定行为**

**@ConditionalOnMissingBean：如果容器中不存在这个Bean（组件），则触发指定行为**

场景：

- 如果存在`FastsqlException`这个类，给容器中放一个`Cat`组件，名cat01，
- 否则，就给容器中放一个`Dog`组件，名dog01
- 如果系统中有`dog01`这个组件，就给容器中放一个 User组件，名zhangsan 
- 否则，就放一个User，名叫lisi

**@ConditionalOnBean（value=组件类型，name=组件名字）：判断容器中是否有这个类型的组件，并且名字是指定的值**



@ConditionalOnRepositoryType (org.springframework.boot.autoconfigure.data)
@ConditionalOnDefaultWebSecurity (org.springframework.boot.autoconfigure.security)
@ConditionalOnSingleCandidate (org.springframework.boot.autoconfigure.condition)
@ConditionalOnWebApplication (org.springframework.boot.autoconfigure.condition)
@ConditionalOnWarDeployment (org.springframework.boot.autoconfigure.condition)
@ConditionalOnJndi (org.springframework.boot.autoconfigure.condition)
@ConditionalOnResource (org.springframework.boot.autoconfigure.condition)
@ConditionalOnExpression (org.springframework.boot.autoconfigure.condition)
**@ConditionalOnClass** (org.springframework.boot.autoconfigure.condition)
@ConditionalOnEnabledResourceChain (org.springframework.boot.autoconfigure.web)
**@ConditionalOnMissingClass** (org.springframework.boot.autoconfigure.condition)
@ConditionalOnNotWebApplication (org.springframework.boot.autoconfigure.condition)
@ConditionalOnProperty (org.springframework.boot.autoconfigure.condition)
@ConditionalOnCloudPlatform (org.springframework.boot.autoconfigure.condition)
**@ConditionalOnBean** (org.springframework.boot.autoconfigure.condition)
**@ConditionalOnMissingBean** (org.springframework.boot.autoconfigure.condition)
@ConditionalOnMissingFilterBean (org.springframework.boot.autoconfigure.web.servlet)
@Profile (org.springframework.context.annotation)
@ConditionalOnInitializedRestarter (org.springframework.boot.devtools.restart)
@ConditionalOnGraphQlSchema (org.springframework.boot.autoconfigure.graphql)
@ConditionalOnJava (org.springframework.boot.autoconfigure.condition)

------



##### 自定义注解

将类的判断定义为动态的，判断哪个字节码文件存在可以动态指定

- 自定义条件注解类

  ```java
  @Target({ElementType.TYPE, ElementType.METHOD})
  @Retention(RetentionPolicy.RUNTIME)
  @Documented
  @Conditional(ClassCondition.class)
  public @interface ConditionOnClass {
      String[] value();
  }
  
  ```

- ClassCondition

  ```java
  public class ClassCondition implements Condition {
      @Override
      public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata metadata) {
  
          //需求：通过注解属性值value指定坐标后创建bean
          Map<String, Object> map = metadata.getAnnotationAttributes
              					(ConditionOnClass.class.getName());
          //map = {value={属性值}}
          //获取所有的
          String[] value = (String[]) map.get("value");
  
          boolean flag = true;
          try {
              for (String className : value) {
                  Class<?> cls = Class.forName(className);
              }
          } catch (Exception e) {
              flag = false;
          }
          return flag;
      }
  }
  
  ```

- UserConfig

  ```java
  @Configuration
  public class UserConfig {
      @Bean
      @ConditionOnClass("com.alibaba.fastjson.JSON")//JSON加载了才注册 User 到容器
      public User user(){
          return new User();
      }
  }
  
  ```

- 测试 User 对象的创建



------



##### 常用注解

SpringBoot 提供的常用条件注解：

@ConditionalOnProperty：判断**配置文件**中是否有对应属性和值才初始化 Bean

```java
@Configuration
public class UserConfig {
    @Bean
    @ConditionalOnProperty(name = "it", havingValue = "seazean")
    public User user() {
        return new User();
    }
}

```

```properties
it=seazean

```

@ConditionalOnClass：判断环境中是否有对应类文件才初始化 Bean

@ConditionalOnMissingClass：判断环境中是否有对应类文件才初始化 Bean

@ConditionalOnMissingBean：判断环境中没有对应Bean才初始化 Bean



------



#### ImportRes

使用 bean.xml 文件生成配置 bean，如果需要继续复用 bean.xml，@ImportResource 导入配置文件即可

```java
@ImportResource("classpath:beans.xml")
public class MyConfig {
	//...
}

```

```xml
<beans ...>
    <bean id="haha" class="com.lun.boot.bean.User">
        <property name="name" value="zhangsan"></property>
        <property name="age" value="18"></property>
    </bean>

    <bean id="hehe" class="com.lun.boot.bean.Pet">
        <property name="name" value="tomcat"></property>
    </bean>
</beans>

```



------



#### Properties

**@ConfigurationProperties：读取到 properties 文件中的内容，并且封装到 JavaBean 中**

配置文件：

```properties
mycar.brand=BYD
mycar.price=100000

```

JavaBean 类：

```java
@Component	//导入到容器内
@ConfigurationProperties(prefix = "mycar")//代表配置文件的前缀
public class Car {
    private String brand;
    private Integer price;
}

```

**@EnableConfigurationProperties：快速注册注解：**

- **场景：**SpringBoot默认只扫描自己主程序所在的包。如果导入第三方包，即使组件上标注了 @Component、@ConfigurationProperties 注解，也没用。因为组件都扫描不进来，此时使用这个注解就可以快速进行属性绑定并把组件注册进容器

将容器中任意**组件（Bean）的属性值**和**配置文件**的配置项的值**进行绑定**

- **1、给容器中注册组件（@Component、@Bean）**
- **2、使用****@ConfigurationProperties 声明组件和配置文件的哪些配置项进行绑定**

------



### 装配原理

#### 启动流程

应用启动：

```java
@SpringBootApplication
public class BootApplication {
    public static void main(String[] args) {
        // 启动代码
        SpringApplication.run(BootApplication.class, args);
    }
}

```

SpringApplication 构造方法：

- `this.resourceLoader = resourceLoader`：资源加载器，初始为 null
- `this.webApplicationType = WebApplicationType.deduceFromClasspath()`：判断当前应用的类型，是响应式还是 Web 类
- `this.bootstrapRegistryInitializers = getBootstrapRegistryInitializersFromSpringFactories()`：**获取引导器**
  - 去 **`META-INF/spring.factories`** 文件中找 org.springframework.boot.Bootstrapper
  - 寻找的顺序：classpath → spring-beans → boot-devtools → springboot → boot-autoconfigure
- `setInitializers(getSpringFactoriesInstances(ApplicationContextInitializer.class))`：**获取初始化器**
  - 去 `META-INF/spring.factories` 文件中找 org.springframework.context.ApplicationContextInitializer
- `setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class))`：**获取监听器**
  - 去 `META-INF/spring.factories` 文件中找 org.springframework.context.ApplicationListener
- `this.mainApplicationClass = deduceMainApplicationClass()`：获取出 main 程序类

SpringApplication#run(String... args)：创建 IOC 容器并实现了自动装配

- `StopWatch stopWatch = new StopWatch()`：停止监听器，**监控整个应用的启停**

- `stopWatch.start()`：记录应用的启动时间

- `bootstrapContext = createBootstrapContext()`：**创建引导上下文环境**

  - `bootstrapContext = new DefaultBootstrapContext()`：创建默认的引导类环境
  - `this.bootstrapRegistryInitializers.forEach()`：遍历所有的引导器调用 initialize 方法完成初始化设置

- `configureHeadlessProperty()`：让当前应用进入 headless 模式

- `listeners = getRunListeners(args)`：**获取所有 RunListener（运行监听器）**

  - 去 `META-INF/spring.factories` 文件中找 org.springframework.boot.SpringApplicationRunListener

- `listeners.starting(bootstrapContext, this.mainApplicationClass)`：遍历所有的运行监听器调用 starting 方法

- `applicationArguments = new DefaultApplicationArguments(args)`：获取所有的命令行参数

- `environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments)`：**准备环境**

  - `environment = getOrCreateEnvironment()`：返回或创建基础环境信息对象
    - `switch (this.webApplicationType)`：**根据当前应用的类型创建环境**
      - `case SERVLET`：Web 应用环境对应 ApplicationServletEnvironment
      - `case REACTIVE`：响应式编程对应 ApplicationReactiveWebEnvironment
      - `default`：默认为 Spring 环境 ApplicationEnvironment
  - `configureEnvironment(environment, applicationArguments.getSourceArgs())`：读取所有配置源的属性值配置环境
  - `ConfigurationPropertySources.attach(environment)`：属性值绑定环境信息
    - `sources.addFirst(ATTACHED_PROPERTY_SOURCE_NAME,..)`：把 configurationProperties 放入环境的属性信息头部
  - `listeners.environmentPrepared(bootstrapContext, environment)`：运行监听器调用 environmentPrepared()，EventPublishingRunListener 发布事件通知所有的监听器当前环境准备完成
  - `DefaultPropertiesPropertySource.moveToEnd(environment)`：移动 defaultProperties 属性源到环境中的最后一个源
  - `bindToSpringApplication(environment)`：与容器绑定当前环境
  - `ConfigurationPropertySources.attach(environment)`：重新将属性值绑定环境信息
  - `sources.remove(ATTACHED_PROPERTY_SOURCE_NAME)`：从环境信息中移除 configurationProperties 
  - `sources.addFirst(ATTACHED_PROPERTY_SOURCE_NAME,..)`：把 configurationProperties 重新放入环境信息

- `configureIgnoreBeanInfo(environment)`：**配置忽略的 bean**

- `printedBanner = printBanner(environment)`：打印 SpringBoot 标志

- `context = createApplicationContext()`：**创建 IOC 容器**

  `switch (this.webApplicationType)`：根据当前应用的类型创建 IOC 容器

  - `case SERVLET`：Web 应用环境对应 AnnotationConfigServletWebServerApplicationContext
  - `case REACTIVE`：响应式编程对应 AnnotationConfigReactiveWebServerApplicationContext
  - `default`：默认为 Spring 环境 AnnotationConfigApplicationContext

- `context.setApplicationStartup(this.applicationStartup)`：设置一个启动器

- `prepareContext()`：配置 IOC 容器的基本信息

  - `postProcessApplicationContext(context)`：后置处理流程
  - `applyInitializers(context)`：获取所有的**初始化器调用 initialize() 方法**进行初始化
  - `listeners.contextPrepared(context)`：所有的运行监听器调用 environmentPrepared() 方法，EventPublishingRunListener 发布事件通知 IOC 容器准备完成
  - `listeners.contextLoaded(context)`：所有的运行监听器调用 contextLoaded() 方法，通知 IOC 加载完成

- `refreshContext(context)`：**刷新 IOC 容器**

  - Spring 的容器启动流程
  - `invokeBeanFactoryPostProcessors(beanFactory)`：**实现了自动装配**
  - `onRefresh()`：**创建 WebServer** 使用该接口

- `afterRefresh(context, applicationArguments)`：留给用户自定义容器刷新完成后的处理逻辑

- `stopWatch.stop()`：记录应用启动完成的时间

- `callRunners(context, applicationArguments)`：调用所有 runners

- `listeners.started(context)`：所有的运行监听器调用 started() 方法

- `listeners.running(context)`：所有的运行监听器调用 running() 方法

  - 获取容器中的 ApplicationRunner、CommandLineRunner
  - `AnnotationAwareOrderComparator.sort(runners)`：合并所有 runner 并且按照 @Order 进行排序
  - `callRunner()`：遍历所有的 runner，调用 run 方法

- `handleRunFailure(context, ex, listeners)`：**处理异常**，出现异常进入该逻辑

  - `handleExitCode(context, exception)`：处理错误代码
  - `listeners.failed(context, exception)`：运行监听器调用 failed() 方法
  - `reportFailure(getExceptionReporters(context), exception)`：通知异常



------



#### 注解分析

SpringBoot 定义了一套接口规范，这套规范规定 SpringBoot 在启动时会扫描外部引用 jar 包中的 `META-INF/spring.factories` 文件，将文件中配置的类型信息加载到 Spring 容器，并执行类中定义的各种操作，对于外部的 jar 包，直接引入一个 starter 即可

@SpringBootApplication 注解是 `@SpringBootConfiguration`、`@EnableAutoConfiguration`、`@ComponentScan` 注解的集合

- @SpringBootApplication 注解

  ```java
  @Inherited
  @SpringBootConfiguration	//代表 @SpringBootApplication 拥有了该注解的功能
  @EnableAutoConfiguration	//同理
  @ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
  		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
  // 扫描被 @Component (@Service,@Controller)注解的 bean，容器中将排除TypeExcludeFilter 和 AutoConfigurationExcludeFilter
  public @interface SpringBootApplication { }
  
  ```

- @SpringBootConfiguration 注解：

  ```java
  @Configuration	// 代表是配置类
  @Indexed
  public @interface SpringBootConfiguration {
  	@AliasFor(annotation = Configuration.class)
  	boolean proxyBeanMethods() default true;
  }
  
  ```

  @AliasFor 注解：表示别名，可以注解到自定义注解的两个属性上表示这两个互为别名，两个属性其实是同一个含义相互替代

- @ComponentScan 注解：默认扫描当前类所在包及其子级包下的所有文件

- **@EnableAutoConfiguration 注解：启用 SpringBoot 的自动配置机制**

  ```java
  @AutoConfigurationPackage	
  @Import(AutoConfigurationImportSelector.class)
  public @interface EnableAutoConfiguration { 
  	String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";
      Class<?>[] exclude() default {}; 
      String[] excludeName() default {};
  }
  
  ```

  - @AutoConfigurationPackage：**将添加该注解的类所在的 package 作为自动配置 package 进行管理**，把启动类所在的包设置一次，为了给各种自动配置的第三方库扫描用，比如带 @Mapper 注解的类，Spring 自身是不能识别的，但自动配置的 Mybatis 需要扫描用到，而 ComponentScan 只是用来扫描注解类，并没有提供接口给三方使用

    ```java
    @Import(AutoConfigurationPackages.Registrar.class)	// 利用 Registrar 给容器中导入组件
    public @interface AutoConfigurationPackage { 
    	String[] basePackages() default {};	//自动配置包，指定了配置类的包
        Class<?>[] basePackageClasses() default {};
    }
    
    ```

    `register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]))`：注册 BD

    - `new PackageImports(metadata).getPackageNames()`：获取添加当前注解的类的所在包
    - `registry.registerBeanDefinition(BEAN, new BasePackagesBeanDefinition(packageNames))`：存放到容器中
      - `new BasePackagesBeanDefinition(packageNames)`：把当前主类所在的包名封装到该对象中

  - @Import(AutoConfigurationImportSelector.class)：**自动装配的核心类**

    容器刷新时执行：**invokeBeanFactoryPostProcessors()** → invokeBeanDefinitionRegistryPostProcessors() → postProcessBeanDefinitionRegistry() → processConfigBeanDefinitions() → parse() → process() → processGroupImports() → getImports() → process() → **AutoConfigurationImportSelector#getAutoConfigurationEntry()**

    ```java
    protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
        if (!isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        }
        // 获取注解属性，@SpringBootApplication 注解的 exclude 属性和 excludeName 属性
        AnnotationAttributes attributes = getAttributes(annotationMetadata);
        // 获取所有需要自动装配的候选项
        List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
        // 去除重复的选项
        configurations = removeDuplicates(configurations);
        // 获取注解配置的排除的自动装配类
        Set<String> exclusions = getExclusions(annotationMetadata, attributes);
        checkExcludedClasses(configurations, exclusions);
        // 移除所有的配置的不需要自动装配的类
        configurations.removeAll(exclusions);
        // 过滤，条件装配
        configurations = getConfigurationClassFilter().filter(configurations);
        // 获取 AutoConfigurationImportListener 类的监听器调用 onAutoConfigurationImportEvent 方法
        fireAutoConfigurationImportEvents(configurations, exclusions);
        // 包装成 AutoConfigurationEntry 返回
        return new AutoConfigurationEntry(configurations, exclusions);
    }
    
    ```

    AutoConfigurationImportSelector#getCandidateConfigurations：**获取自动配置的候选项**

    - `List<String> configurations = SpringFactoriesLoader.loadFactoryNames()`：加载自动配置类

      参数一：`getSpringFactoriesLoaderFactoryClass()`：获取 @EnableAutoConfiguration 注解类

      参数二：`getBeanClassLoader()`：获取类加载器

      - `factoryTypeName = factoryType.getName()`：@EnableAutoConfiguration 注解的全类名
      - `return loadSpringFactories(classLoaderToUse).getOrDefault()`：加载资源
        - `urls = classLoader.getResources(FACTORIES_RESOURCE_LOCATION)`：获取资源类
        - `FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories"`：**加载的资源的位置**

    - `return configurations`：返回所有自动装配类的候选项

  - 从 spring-boot-autoconfigure-2.5.3.jar/META-INF/spring.factories 文件中寻找 EnableAutoConfiguration 字段，获取自动装配类，**进行条件装配，按需装配**

    ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/SpringBoot-%25E8%2587%25AA%25E5%258A%25A8%25E8%25A3%2585%25E9%2585%258D%25E9%2585%258D%25E7%25BD%25AE%25E6%2596%2587%25E4%25BB%25B6.png)





------



#### 装配流程

Spring Boot 通过 `@EnableAutoConfiguration` 开启自动装配，通过 SpringFactoriesLoader 加载 `META-INF/spring.factories` 中的自动配置类实现自动装配，自动配置类其实就是通过 `@Conditional` 注解按需加载的配置类，想要其生效必须引入 `spring-boot-starter-xxx` 包实现起步依赖

- SpringBoot 先加载所有的自动配置类 xxxxxAutoConfiguration
- 每个自动配置类进行**条件装配**，默认都会绑定配置文件指定的值（xxxProperties 和配置文件进行了绑定）
- SpringBoot 默认会在底层配好所有的组件，如果用户自己配置了**以用户的优先**
- **定制化配置：**
  - 用户可以使用 @Bean 新建自己的组件来替换底层的组件
  - 用户可以去看这个组件是获取的配置文件前缀值，在配置文件中修改

以 DispatcherServletAutoConfiguration 为例：

```java
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
// 类中的 Bean 默认不是单例
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
// 条件装配，环境中有 DispatcherServlet 类才进行自动装配
@ConditionalOnClass(DispatcherServlet.class)
@AutoConfigureAfter(ServletWebServerFactoryAutoConfiguration.class)
public class DispatcherServletAutoConfiguration {
	// 注册的 DispatcherServlet 的 BeanName
	public static final String DEFAULT_DISPATCHER_SERVLET_BEAN_NAME = "dispatcherServlet";

	@Configuration(proxyBeanMethods = false)
	@Conditional(DefaultDispatcherServletCondition.class)
	@ConditionalOnClass(ServletRegistration.class)
    // 绑定配置文件的属性，从配置文件中获取配置项
	@EnableConfigurationProperties(WebMvcProperties.class)
	protected static class DispatcherServletConfiguration {
		
        // 给容器注册一个 DispatcherServlet，起名字为 dispatcherServlet
		@Bean(name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
		public DispatcherServlet dispatcherServlet(WebMvcProperties webMvcProperties) {
            // 新建一个 DispatcherServlet 设置相关属性
			DispatcherServlet dispatcherServlet = new DispatcherServlet();
            // spring.mvc 中的配置项获取注入，没有就填充默认值
			dispatcherServlet.setDispatchOptionsRequest(webMvcProperties.isDispatchOptionsRequest());
			// ......
            // 返回该对象注册到容器内
			return dispatcherServlet;
		}

		@Bean
        // 容器中有这个类型组件才进行装配
		@ConditionalOnBean(MultipartResolver.class)
        // 容器中没有这个名字 multipartResolver 的组件
		@ConditionalOnMissingBean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
        // 方法名就是 BeanName
		public MultipartResolver multipartResolver(MultipartResolver resolver) {
			// 给 @Bean 标注的方法传入了对象参数，这个参数就会从容器中找，因为用户自定义了该类型，以用户配置的优先
            // 但是名字不符合规范，所以获取到该 Bean 并返回到容器一个规范的名称：multipartResolver
			return resolver;
		}
	}
}
```

```java
// 将配置文件中的 spring.mvc 前缀的属性与该类绑定
@ConfigurationProperties(prefix = "spring.mvc")	
public class WebMvcProperties { }

```





------



### 事件监听

SpringBoot 在项目启动时，会对几个监听器进行回调，可以实现监听器接口，在项目启动时完成一些操作

ApplicationContextInitializer、SpringApplicationRunListener、CommandLineRunner、ApplicationRunner

- MyApplicationRunner

  **自定义监听器的启动时机**：MyApplicationRunner 和 MyCommandLineRunner 都是当项目启动后执行，使用 @Component 放入容器即可使用

  ```java
  //当项目启动后执行run方法
  @Component
  public class MyApplicationRunner implements ApplicationRunner {
      @Override
      public void run(ApplicationArguments args) throws Exception {
          System.out.println("ApplicationRunner...run");
          System.out.println(Arrays.asList(args.getSourceArgs()));//properties配置信息
      }
  } 
  
  ```

- MyCommandLineRunner

  ```java
  @Component
  public class MyCommandLineRunner implements CommandLineRunner {
      @Override
      public void run(String... args) throws Exception {
          System.out.println("CommandLineRunner...run");
          System.out.println(Arrays.asList(args));
      }
  }
  
  ```

- MyApplicationContextInitializer 的启用要**在 resource 文件夹下添加 META-INF/spring.factories**

  ```properties
  org.springframework.context.ApplicationContextInitializer=\
  com.example.springbootlistener.listener.MyApplicationContextInitializer
  
  ```

  ```java
  @Component
  public class MyApplicationContextInitializer implements ApplicationContextInitializer {
      @Override
      public void initialize(ConfigurableApplicationContext applicationContext) {
          System.out.println("ApplicationContextInitializer....initialize");
      }
  }
  
  ```

- MySpringApplicationRunListener 的使用要添加**构造器**

  ```java
  public class MySpringApplicationRunListener implements SpringApplicationRunListener {
  	//构造器
      public MySpringApplicationRunListener(SpringApplication sa, String[] args) {
      }
  
      @Override
      public void starting() {
          System.out.println("starting...项目启动中");//输出SPRING之前
      }
  
      @Override
      public void environmentPrepared(ConfigurableEnvironment environment) {
          System.out.println("environmentPrepared...环境对象开始准备");
      }
  
      @Override
      public void contextPrepared(ConfigurableApplicationContext context) {
          System.out.println("contextPrepared...上下文对象开始准备");
      }
  
      @Override
      public void contextLoaded(ConfigurableApplicationContext context) {
          System.out.println("contextLoaded...上下文对象开始加载");
      }
  
      @Override
      public void started(ConfigurableApplicationContext context) {
          System.out.println("started...上下文对象加载完成");
      }
  
      @Override
      public void running(ConfigurableApplicationContext context) {
          System.out.println("running...项目启动完成，开始运行");
      }
  
      @Override
      public void failed(ConfigurableApplicationContext context, Throwable exception) {
          System.out.println("failed...项目启动失败");
      }
  }
  
  ```

  





------





## 配置文件

### 配置方式

#### 文件类型

SpringBoot 是基于约定的，很多配置都有默认值，如果想使用自己的配置替换默认配置，可以使用 application.properties 或者 application.yml（application.yaml）进行配置

- 默认配置文件名称：application
- 在同一级目录下优先级为：properties > yml > yaml

例如配置内置 Tomcat 的端口

- properties：

  ```properties
  server.port=8080
  
  ```

- yml：

  ```yaml
  server: port: 8080
  
  ```

- yaml：

  ```yaml
  server: port: 8080
  
  ```



------



#### 加载顺序

所有位置的配置文件都会被加载，互补配置，**高优先级配置内容会覆盖低优先级配置内容**

扫描配置文件的位置按优先级**从高到底**：

- `file:./config/`：**当前项目**下的 /config 目录下
- `file:./`：当前项目的根目录，Project工程目录
- `classpath:/config/`：classpath 的 /config 目录
- `classpath:/`：classpath 的根目录，就是 resoureces 目录

项目外部配置文件加载顺序：外部配置文件的使用是为了对内部文件的配合

- 命令行：在 package 打包后的 target 目录下，使用该命令

  ```sh
  java -jar myproject.jar --server.port=9000
  
  ```

- 指定配置文件位置

  ```sh
  java -jar myproject.jar --spring.config.location=e://application.properties
  
  ```

- 按优先级从高到底选择配置文件的加载命令

  ```sh
  java -jar myproject.jar
  
  ```

  



------



### yaml语法

基本语法：

- 大小写敏感

- **数据值前边必须有空格，作为分隔符**

- 使用缩进表示层级关系

- 缩进时不允许使用Tab键，只允许使用空格（各个系统 Tab对应空格数目可能不同，导致层次混乱）

- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可

- ''#" 表示注释，从这个字符一直到行尾，都会被解析器忽略

  ```yaml
  server: 
  	port: 8080  
      address: 127.0.0.1
  
  ```

数据格式：

- 纯量：单个的、不可再分的值

  ```yaml
  msg1: 'hello \n world'  # 单引忽略转义字符
  msg2: "hello \n world"  # 双引识别转义字符
  
  ```

- 对象：键值对集合，Map、Hash

  ```yaml
  person:  
     name: zhangsan
     age: 20
  # 行内写法
  person: {name: zhangsan}
  
  ```

  注意：不建议使用 JSON，应该使用 yaml 语法

- 数组：一组按次序排列的值，List、Array

  ```yaml
  address:
    - beijing
    - shanghai
  # 行内写法
  address: [beijing,shanghai]
  
  ```

  ```yaml
  allPerson	#List<Person>
    - {name:lisi, age:18}
    - {name:wangwu, age:20}
  # 行内写法
  allPerson: [{name:lisi, age:18}, {name:wangwu, age:20}]
  
  ```

- 参数引用：

  ```yaml
  name: lisi 
  person:
    name: ${name} # 引用上边定义的name值
  
  ```

**细节**:

- birthDay 推荐写为 birth-day
- **文本**：

- - **单引号**不会转义【\n 则为普通字符串显示】
  - **双引号**会转义【\n会显示为**换行符**】

- **大文本**

- - `|`开头，大文本写在下层，**保留文本格式**，**换行符正确显示**
  - `>`开头，大文本写在下层，折叠换行符

- **多文档合并**

- - 使用`---`可以把多个yaml文档合并在一个文档中，每个文档区依然认为内容独立

------

### 日志配置

规范：项目开发不要编写`System.out.println()`，应该用**日志**记录信息

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689233262423.png)



1. Spring使用commons-logging作为内部日志，但底层日志实现是开放的。可对接其他日志框架。

2. 1. spring5及以后 commons-logging被spring直接自己写了。

3. 支持 jul，log4j2,logback。SpringBoot 提供了默认的控制台输出配置，也可以配置输出为文件。
4. logback是默认使用的。
5. 虽然**日志框架很多**，但是我们不用担心，使用 SpringBoot 的**默认配置就能工作的很好**。



**SpringBoot怎么把日志默认配置好的**

1、每个`starter`场景，都会导入一个核心场景`spring-boot-starter`

2、核心场景引入了日志的所用功能`spring-boot-starter-logging`

3、默认使用了`logback + slf4j` 组合作为默认底层日志

4、`日志是系统一启动就要用`，`xxxAutoConfiguration`是系统启动好了以后放好的组件，后来用的。

5、日志是利用**监听器机制**配置好的。`ApplicationListener`。

6、日志所有的配置都可以通过修改配置文件实现。以`logging`开始的所有配置。



#### 日志格式

```shell
2023-03-31T13:56:17.511+08:00  INFO 4944 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-03-31T13:56:17.511+08:00  INFO 4944 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.7]
```

默认输出格式：

- 时间和日期：毫秒级精度
- 日志级别：ERROR, WARN, INFO, DEBUG, or TRACE.
- 进程 ID
- ---： 消息分割符
- 线程名： 使用[]包含
- Logger 名： 通常是产生日志的**类名**
- 消息： 日志记录的内容

注意： logback 没有FATAL级别，对应的是ERROR



默认值：参照：`spring-boot`包`additional-spring-configuration-metadata.json`文件

默认输出格式值：`%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}`

可修改为：`'%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{15} ===> %msg%n'`

#### 记录日志

```java
Logger logger = LoggerFactory.getLogger(getClass());
logger.info("haha,方法进来了");

或者使用Lombok的@Slf4j注解
log.info("哈哈，方法进来啦");
```

 日志级别

- 由低到高：`ALL,TRACE, DEBUG, INFO, WARN, ERROR,FATAL,OFF`；

- - **只会打印指定级别及以上级别的日志**
  - ALL：打印所有日志
  - TRACE：追踪框架详细流程日志，一般不使用
  - DEBUG：开发调试细节日志
  - INFO：关键、感兴趣信息日志
  - WARN：警告但不是错误的信息日志，比如：版本过时
  - ERROR：业务错误日志，比如出现各种异常
  - FATAL：致命错误日志，比如jvm系统崩溃
  - OFF：关闭所有日志记录

- 不指定级别的所有类，都使用root指定的级别作为默认级别
- SpringBoot日志**默认级别是** **INFO**



1. 在application.properties/yaml中配置`logging.level.<logger-name>=<level>`指定日志级别
2. level可取值范围：`TRACE, DEBUG, INFO, WARN, ERROR, FATAL, or OFF`，定义在 `LogLevel`类中
3. root 的logger-name叫root，可以配置logging.level.root=warn，代表所有未指定日志级别都使用 root 的 warn 级别



#### 日志分组

比较有用的技巧是：

将相关的logger分组在一起，统一配置。SpringBoot 也支持。比如：Tomcat 相关的日志统一设置

```java
logging.group.tomcat=org.apache.catalina,org.apache.coyote,org.apache.tomcat
logging.level.tomcat=trace
```



SpringBoot 预定义两个组

| Name | Loggers                                                      |
| ---- | ------------------------------------------------------------ |
| web  | org.springframework.core.codec, org.springframework.http, org.springframework.web, org.springframework.boot.actuate.endpoint.web, org.springframework.boot.web.servlet.ServletContextInitializerBeans |
| sql  | org.springframework.jdbc.core, org.hibernate.SQL, org.jooq.tools.LoggerListener |

#### 文件输出

SpringBoot 默认只把日志写在控制台，如果想额外记录到文件，可以在application.properties中添加logging.file.name or logging.file.path配置项。

| logging.file.name | logging.file.path | 示例     | 效果                             |
| ----------------- | ----------------- | -------- | -------------------------------- |
| 未指定            | 未指定            |          | 仅控制台输出                     |
| **指定**          | 未指定            | my.log   | 写入指定文件。可以加路径         |
| 未指定            | **指定**          | /var/log | 写入指定目录，文件名为spring.log |
| **指定**          | **指定**          |          | 以logging.file.name为准          |

#### 文件归档与滚动切割

归档：每天的日志单独存到一个文档中。

切割：每个文件10MB，超过大小切割成另外一个文件。

1. 每天的日志应该独立分割出来存档。如果使用logback（SpringBoot 默认整合），可以通过application.properties/yaml文件指定日志滚动规则。
2. 如果是其他日志系统，需要自行配置（添加log4j2.xml或log4j2-spring.xml）
3. 支持的滚动规则设置如下

| 配置项                                               | 描述                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| logging.logback.rollingpolicy.file-name-pattern      | 日志存档的文件名格式（默认值：${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz） |
| logging.logback.rollingpolicy.clean-history-on-start | 应用启动时是否清除以前存档（默认值：false）                  |
| logging.logback.rollingpolicy.max-file-size          | 存档前，每个日志文件的最大大小（默认值：10MB）               |
| logging.logback.rollingpolicy.total-size-cap         | 日志文件被删除之前，可以容纳的最大大小（默认值：0B）。设置1GB则磁盘存储超过 1GB 日志后就会删除旧日志文件 |
| logging.logback.rollingpolicy.max-history            | 日志文件保存的最大天数(默认值：7).                           |

#### 自定义配置

通常我们配置 application.properties 就够了。当然也可以自定义。比如：

| 日志系统                | 自定义                                                       |
| ----------------------- | ------------------------------------------------------------ |
| Logback                 | logback-spring.xml, logback-spring.groovy, logback.xml, or logback.groovy |
| Log4j2                  | log4j2-spring.xml or log4j2.xml                              |
| JDK (Java Util Logging) | logging.properties                                           |

如果可能，我们建议您在日志配置中使用`-spring` 变量（例如，`logback-spring.xml` 而不是 `logback.xml`）。如果您使用标准配置文件，spring 无法完全控制日志初始化。

最佳实战：自己要写配置，配置文件名加上 `xx-spring.xml`

####  切换日志组合

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

log4j2支持yaml和json格式的配置文件

| 格式 | 依赖                                                         | 文件名                   |
| ---- | ------------------------------------------------------------ | ------------------------ |
| YAML | com.fasterxml.jackson.core:jackson-databind + com.fasterxml.jackson.dataformat:jackson-dataformat-yaml | log4j2.yaml + log4j2.yml |
| JSON | com.fasterxml.jackson.core:jackson-databind                  | log4j2.json + log4j2.jsn |

####  最佳实战

1. 导入任何第三方框架，先排除它的日志包，因为Boot底层控制好了日志
2. 修改 `application.properties` 配置文件，就可以调整日志的所有行为。如果不够，可以编写日志框架自己的配置文件放在类路径下就行，比如`logback-spring.xml`，`log4j2-spring.xml`
3. 如需对接**专业日志系统**，也只需要把 logback 记录的**日志**灌倒 **kafka**之类的中间件，这和SpringBoot没关系，都是日志框架自己的配置，**修改配置文件即可**
4. **业务中使用slf4j-api记录日志。不要再 sout 了**

------



### 获取配置

三种获取配置文件的方式：

- 注解 @Value

  ```java
  @RestController
  public class HelloController {
      @Value("${name}")
      private String name;
  
      @Value("${person.name}")
      private String name2;
  
      @Value("${address[0]}")
      private String address1;
  
      @Value("${msg1}")
      private String msg1;
  
      @Value("${msg2}")
      private String msg2;
      
      @RequestMapping("/hello")
      public String hello(){
          System.out.println("所有的数据");
          return " hello Spring Boot !";
      }
  }
  
  ```

- Evironment 对象

  ```java
  @Autowired
  private Environment env;
  
  @RequestMapping("/hello")
  public String hello() {
      System.out.println(env.getProperty("person.name"));
      System.out.println(env.getProperty("address[0]"));
      return " hello Spring Boot !";
  }
  
  ```

- 注解 @ConfigurationProperties 配合 @Component 使用

  **注意**：参数 prefix 一定要指定

  ```java
  @Component	//不扫描该组件到容器内，无法完成自动装配
  @ConfigurationProperties(prefix = "person")
  public class Person {
      private String name;
      private int age;
      private String[] address;
  }
  
  ```

  ```java
  @Autowired
  private Person person;
  
  @RequestMapping("/hello")
  public String hello() {
      System.out.println(person);
      //Person{name='zhangsan', age=20, address=[beijing, shanghai]}
      return " hello Spring Boot !";
  }
  
  ```

  

------



### 配置提示

自定义的类和配置文件绑定一般没有提示，添加如下依赖可以使用提示：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>

<!-- 下面插件作用是工程打包时，不将spring-boot-configuration-processor打进包内，让其只在编码的时候有用 -->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-configuration-processor</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>

```





------



### Profile

@Profile：指定组件在哪个环境的情况下才能被注册到容器中，不指定，任何环境下都能注册这个组件

- 加了环境标识的 bean，只有这个环境被激活的时候才能注册到容器中，默认是 default 环境
- 写在配置类上，只有是指定的环境的时候，整个配置类里面的所有配置才能开始生效
- 没有标注环境标识的 bean 在，任何环境下都是加载的

Profile 的配置：

- **profile 是用来完成不同环境下，配置动态切换功能**

- **profile 配置方式**：多 profile 文件方式，提供多个配置文件，每个代表一种环境

  - application-dev.properties/yml 开发环境
  - application-test.properties/yml 测试环境
  - sapplication-pro.properties/yml 生产环境

- yml 多文档方式：在 yml 中使用  --- 分隔不同配置

  ```yacas
  ---
  server:
    port: 8081
  spring:
    profiles:dev
  ---
  server:
    port: 8082
  spring:
    profiles:test
  ---
  server:
    port: 8083
  spring:
    profiles:pro
  ---
  
  ```

- **profile 激活方式**

  - 配置文件：在配置文件中配置：spring.profiles.active=dev

    ```properties
    spring.profiles.active=dev
    
    ```

  - 虚拟机参数：在VM options 指定：`-Dspring.profiles.active=dev`

    ![](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/SpringBoot-profile%25E6%25BF%2580%25E6%25B4%25BB%25E6%2596%25B9%25E5%25BC%258F%25E8%2599%259A%25E6%258B%259F%25E6%259C%25BA%25E5%258F%2582%25E6%2595%25B0.png)

  - 命令行参数：`java –jar xxx.jar  --spring.profiles.active=dev`

    在 Program arguments 里输入，也可以先 package







------





## Web开发

### 最佳实践

SpringBoot 已经默认配置好了**Web开发**场景常用功能。我们直接使用即可。

#### 三种方式

| 方式         | 用法                                                         | 效果                             |                                                           |
| ------------ | ------------------------------------------------------------ | -------------------------------- | --------------------------------------------------------- |
| **全自动**   | 直接编写控制器逻辑                                           |                                  | 全部使用**自动配置默认效果**                              |
| **手自一体** | `@Configuration` +   配置`**WebMvcConfigurer**`+ *配置 WebMvcRegistrations* | **不要标注** `@**EnableWebMvc**` | **保留自动配置效果** **手动设置部分功能** 定义MVC底层组件 |
| **全手动**   | `@Configuration` +   配置`**WebMvcConfigurer**`              | **标注** `@**EnableWebMvc**`     | **禁用自动配置效果** **全手动设置**                       |

总结：

**给容器中写一个配置类**`**@Configuration**`**实现** `**WebMvcConfigurer**`**但是不要标注** `**@EnableWebMvc**`**注解，实现手自一体的效果。**



#### 两种模式

1、`前后分离模式`： `@RestController `响应JSON数据

2、`前后不分离模式`：@Controller + Thymeleaf模板引擎

### 功能支持

SpringBoot 自动配置了很多约定，大多场景都无需自定义配置

- 包含了 ContentNegotiatingViewResolver 和 BeanNameViewResolver 组件，**方便视图解析**
- **默认的静态资源处理机制**： 静态资源放在 static 文件夹下即可直接访问
- **自动注册**了 **Converter**,GenericConverter,**Formatter**组件，适配常见**数据类型转换**和**格式化需求**
- **支持** **HttpMessageConverters**，可以**方便返回**json等**数据类型**
- **注册** MessageCodesResolver，方便**国际化**及错误消息处理
- **支持 静态** index.html
- **自动使用**ConfigurableWebBindingInitializer，实现消息处理、数据绑定、类型转化、数据校验等功能

**重要：**

- *如果想保持* **boot mvc 的默认配置***，并且自定义更多的 mvc 配置，如：***interceptors***,* **formatters***,* **view controllers** *等。可以使用**@Configuration**注解添加一个* *WebMvcConfigurer* *类型的配置类，并不要标注* *@EnableWebMvc*
- *如果想保持 boot mvc 的默认配置，但要自定义核心组件实例，比如：**RequestMappingHandlerMapping**,* *RequestMappingHandlerAdapter**, 或**ExceptionHandlerExceptionResolver**，给容器中放一个* *WebMvcRegistrations* *组件即可*
- *如果想全面接管 Spring MVC，**@Configuration* *标注一个配置类，并加上* *@EnableWebMvc**注解，实现* *WebMvcConfigurer* *接口*

开发规范：

- 使用 `@Configuration` + `WebMvcConfigurer` 自定义规则，不使用 `@EnableWebMvc` 注解
- 声明 `WebMvcRegistrations` 的实现类改变默认底层组件
- 使用 `@EnableWebMvc` + `@Configuration` + `DelegatingWebMvcConfiguration` 全面接管 SpringMVC



------

### WebMvcAutoConfiguration原理

#### 生效条件

```java
@AutoConfiguration(after = { DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class }) //在这些自动配置之后
@ConditionalOnWebApplication(type = Type.SERVLET) //如果是web应用就生效，类型SERVLET、REACTIVE 响应式web
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class) //容器中没有这个Bean，才生效。默认就是没有
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)//优先级
@ImportRuntimeHints(WebResourcesRuntimeHints.class)
public class WebMvcAutoConfiguration { 
}@AutoConfiguration(after = { DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class }) //在这些自动配置之后
@ConditionalOnWebApplication(type = Type.SERVLET) //如果是web应用就生效，类型SERVLET、REACTIVE 响应式web
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class) //容器中没有这个Bean，才生效。默认就是没有
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)//优先级
@ImportRuntimeHints(WebResourcesRuntimeHints.class)
public class WebMvcAutoConfiguration { 
}
```



#### 效果

1. 放了两个Filter：

1. 1.  `HiddenHttpMethodFilter`；页面表单提交Rest请求（GET、POST、PUT、DELETE）
   2.  `FormContentFilter`： 表单内容Filter，GET（数据放URL后面）、POST（数据放请求体）请求可以携带数据，PUT、DELETE 的请求体数据会被忽略

1. 给容器中放了`WebMvcConfigurer`组件；给SpringMVC添加各种定制功能

1. 1. 所有的功能最终会和配置文件进行绑定
   2. WebMvcProperties： `spring.mvc`配置文件
   3. WebProperties： `spring.web`配置文件

```java
	@Configuration(proxyBeanMethods = false)
	@Import(EnableWebMvcConfiguration.class) //额外导入了其他配置
	@EnableConfigurationProperties({ WebMvcProperties.class, WebProperties.class })
	@Order(0)
	public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware{
        
    }	@Configuration(proxyBeanMethods = false)
	@Import(EnableWebMvcConfiguration.class) //额外导入了其他配置
	@EnableConfigurationProperties({ WebMvcProperties.class, WebProperties.class })
	@Order(0)
	public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware{
        
    }
```



#### WebMvcConfigurer接口

提供了配置SpringMVC底层的所有组件入口

![1689329226202](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1689329226202.png)

### 静态资源

#### 访问规则

默认的静态资源路径是 classpath 下的，优先级由高到低为：/META-INF/resources、/resources、 /static、/public  的包内，`/` 表示当前项目的根路径

静态映射 `/**` ，表示请求 `/ + 静态资源名` 就直接去默认的资源路径寻找请求的资源

处理原理：静态请求去寻找 Controller 处理，不能处理的请求就会交给静态资源处理器，静态资源也找不到就响应 404 页面

访问： `/webjars/**`路径就去 `classpath:/META-INF/resources/webjars/`下找资源.但要先导入maven依赖

- 修改默认资源路径：

  ```yaml
  spring:
    web:
      resources:
        static-locations:: [classpath:/haha/]
  
  ```

- 修改静态资源访问前缀，默认是 `/**`：

  ```yaml
  spring:
    mvc:
      static-path-pattern: /resources/**
  ```

  访问 URL：http://localhost:8080/resources/ + 静态资源名，将所有资源**重定位**到 `/resources/`

- webjar 访问资源：

  ```xml
  <dependency>
      <groupId>org.webjars</groupId>
      <artifactId>jquery</artifactId>
      <version>3.5.1</version>
  </dependency>
  ```

  访问地址：http://localhost:8080/webjars/jquery/3.5.1/jquery.js，后面地址要按照依赖里面的包路径

1. **静态资源默认都有缓存规则的设置**

1. 1. 所有缓存的设置，直接通过**配置文件**： `spring.web`
   2. cachePeriod： 缓存周期； 多久不用找服务器要新的。 默认没有，以s为单位
   3. cacheControl： **HTTP缓存**控制；[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#概览)
   4. **useLastModified**：是否使用最后一次修改。配合HTTP Cache规则

如果浏览器访问了一个静态资源 `index.js`，如果服务这个资源没有发生变化，下次访问的时候就可以直接让浏览器用自己缓存中的东西，而不用给服务器发请求。

```java
registration.setCachePeriod(getSeconds(this.resourceProperties.getCache().getPeriod()));
registration.setCacheControl(this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl());
registration.setUseLastModified(this.resourceProperties.getCache().isUseLastModified());registration.setCachePeriod(getSeconds(this.resourceProperties.getCache().getPeriod()));
registration.setCacheControl(this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl());
registration.setUseLastModified(this.resourceProperties.getCache().isUseLastModified());
```

  **缓存实验**

```properties
#1、spring.web：
# 1.配置国际化的区域信息
# 2.静态资源策略(开启、处理链、缓存)

#开启静态资源映射规则
spring.web.resources.add-mappings=true

#设置缓存
#spring.web.resources.cache.period=3600
##缓存详细合并项控制，覆盖period配置：
## 浏览器第一次请求服务器，服务器告诉浏览器此资源缓存7200秒，7200秒以内的所有此资源访问不用发给服务器请求，7200秒以后发请求给服务器
spring.web.resources.cache.cachecontrol.max-age=7200
#使用资源 last-modified 时间，来对比服务器和浏览器的资源是否相同没有变化。相同返回 304
spring.web.resources.cache.use-last-modified=true
```



#### 自定义静态资源规则

自定义静态资源路径、自定义缓存规则

##### 配置方式

`spring.mvc`： 静态资源访问前缀路径

`spring.web`：

- 静态资源目录
- 静态资源缓存策略

```properties
#1、spring.web：
# 1.配置国际化的区域信息
# 2.静态资源策略(开启、处理链、缓存)

#开启静态资源映射规则
spring.web.resources.add-mappings=true

#设置缓存
spring.web.resources.cache.period=3600
##缓存详细合并项控制，覆盖period配置：
## 浏览器第一次请求服务器，服务器告诉浏览器此资源缓存7200秒，7200秒以内的所有此资源访问不用发给服务器请求，7200秒以后发请求给服务器
spring.web.resources.cache.cachecontrol.max-age=7200
## 共享缓存
spring.web.resources.cache.cachecontrol.cache-public=true
#使用资源 last-modified 时间，来对比服务器和浏览器的资源是否相同没有变化。相同返回 304
spring.web.resources.cache.use-last-modified=true

#自定义静态资源文件夹位置
spring.web.resources.static-locations=classpath:/a/,classpath:/b/,classpath:/static/

#2、 spring.mvc
## 2.1. 自定义webjars路径前缀
spring.mvc.webjars-path-pattern=/wj/**
## 2.2. 静态资源访问路径前缀
spring.mvc.static-path-pattern=/static/**
```

代码方式

- 容器中只要有一个 WebMvcConfigurer 组件。配置的底层行为都会生效

原因：

1. WebMvcAutoConfiguration 是一个自动配置类，它里面有一个 `EnableWebMvcConfiguration`
2. `EnableWebMvcConfiguration`继承与 `DelegatingWebMvcConfiguration`，这两个都生效
3. `DelegatingWebMvcConfiguration`利用 DI 把容器中 所有 `WebMvcConfigurer `注入进来
4. 别人调用 ``DelegatingWebMvcConfiguration`` 的方法配置底层规则，而它调用所有 `WebMvcConfigurer`的配置底层方法。

```java
//@EnableWebMvc 禁用boot的默认配置
@Configuration //这是一个配置类
public class MyConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //保留以前规则
        WebMvcConfigurer.super.addResourceHandlers(registry);
        //自己写新的规则。
        registry.addResourceHandler("/static/**")
               .addResourceLocations("classpath:/a/","classpath:/b/")
                .setCacheControl(CacheControl.maxAge(1180, TimeUnit.SECONDS));
    }
}
```



------



#### 欢迎页面

静态资源路径下 index.html 默认作为欢迎页面，访问 http://localhost:8080 出现该页面，使用 welcome page 功能不能修改前缀

网页标签上的小图标可以自定义规则，把资源重命名为 favicon.ico 放在静态资源目录下即可



------



#### 源码分析

SpringMVC 功能的自动配置类 WebMvcAutoConfiguration：

```java
public class WebMvcAutoConfiguration {
    //当前项目的根路径
    private static final String SERVLET_LOCATION = "/";
}
```

- 内部类 WebMvcAutoConfigurationAdapter：

  ```java
  @Import(EnableWebMvcConfiguration.class)
  // 绑定 spring.mvc、spring.web、spring.resources 相关的配置属性
  @EnableConfigurationProperties({ WebMvcProperties.class,ResourceProperties.class, WebProperties.class })
  @Order(0)
  public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {
  	//有参构造器所有参数的值都会从容器中确定
      public WebMvcAutoConfigurationAdapter(/*参数*/) {
  			this.resourceProperties = resourceProperties.hasBeenCustomized() ? resourceProperties
  					: webProperties.getResources();
  			this.mvcProperties = mvcProperties;
  			this.beanFactory = beanFactory;
  			this.messageConvertersProvider = messageConvertersProvider;
  			this.resourceHandlerRegistrationCustomizer = resourceHandlerRegistrationCustomizerProvider.getIfAvailable();
  			this.dispatcherServletPath = dispatcherServletPath;
  			this.servletRegistrations = servletRegistrations;
  			this.mvcProperties.checkConfiguration();
  	}
  }
  
  ```

  - ResourceProperties resourceProperties：获取和 spring.resources 绑定的所有的值的对象
  - WebMvcProperties mvcProperties：获取和 spring.mvc 绑定的所有的值的对象
  - ListableBeanFactory beanFactory：Spring 的 beanFactory
  - HttpMessageConverters：找到所有的 HttpMessageConverters
  - ResourceHandlerRegistrationCustomizer：找到 资源处理器的自定义器。
  - DispatcherServletPath：项目路径
  - ServletRegistrationBean：给应用注册 Servlet、Filter

- WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter.addResourceHandler()：两种静态资源映射规则

  ```java
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
      //配置文件设置 spring.resources.add-mappings: false，禁用所有静态资源
      if (!this.resourceProperties.isAddMappings()) {
          logger.debug("Default resource handling disabled");//被禁用
          return;
      }
      //注册webjars静态资源的映射规则	映射			路径
      addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
      //注册静态资源路径的映射规则		 默认映射 staticPathPattern = "/**" 
      addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
          //staticLocations = CLASSPATH_RESOURCE_LOCATIONS
          registration.addResourceLocations(this.resourceProperties.getStaticLocations());
          if (this.servletContext != null) {
              ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
              registration.addResourceLocations(resource);
          }
      });
  }
  
  ```

  ```java
  @ConfigurationProperties("spring.web")
  public class WebProperties {
      public static class Resources {
      	//默认资源路径，优先级从高到低
      	static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/META-INF/resources/",
                                                   "classpath:/resources/", 
                                                   "classpath:/static/", "classpath:/public/" }
          private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
          //可以进行规则重写
          public void setStaticLocations(String[] staticLocations) {
  			this.staticLocations = appendSlashIfNecessary(staticLocations);
  			this.customized = true;
  		}
      }
  }
  
  ```

- WebMvcAutoConfiguration.EnableWebMvcConfiguration.welcomePageHandlerMapping()：欢迎页

  ```java
  //spring.web 属性
  @EnableConfigurationProperties(WebProperties.class)
  public static class EnableWebMvcConfiguration {
      @Bean
      public WelcomePageHandlerMapping welcomePageHandlerMapping(/*参数*/) {
          WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
              new TemplateAvailabilityProviders(applicationContext), 
              applicationContext, getWelcomePage(),
              //staticPathPattern = "/**"
              this.mvcProperties.getStaticPathPattern());
          return welcomePageHandlerMapping;
      }
  }
  WelcomePageHandlerMapping(/*参数*/) {
      //所以限制 staticPathPattern 必须为 /** 才能启用该功能
      if (welcomePage != null && "/**".equals(staticPathPattern)) {
          logger.info("Adding welcome page: " + welcomePage);
          //重定向
          setRootViewName("forward:index.html");
      }
      else if (welcomeTemplateExists(templateAvailabilityProviders, applicationContext)) {
          logger.info("Adding welcome page template: index");
          setRootViewName("index");
      }
  }
  
  ```

  WelcomePageHandlerMapping，访问 / 能访问到 index.html



------

### 路径匹配

**Spring5.3** 之后加入了更多的请求路径匹配的实现策略；

以前只支持 AntPathMatcher 策略, 现在提供了 **PathPatternParser** 策略。并且可以让我们指定到底使用那种策略。

#### Ant风格路径用法

Ant 风格的路径模式语法具有以下规则：

- *：表示**任意数量**的字符。
- ?：表示任意**一个字符**。
- **：表示任意数量的目录。
- {}：表示一个命名的模式**占位符**。
- []：表示**字符集合**，例如[a-z]表示小写字母。

例如：

- *.html 匹配任意名称，扩展名为.html的文件。
- /folder1/*/*.java 匹配在folder1目录下的任意两级目录下的.java文件。
- /folder2/**/*.jsp 匹配在folder2目录下任意目录深度的.jsp文件。
- /{type}/{id}.html 匹配任意文件名为{id}.html，在任意命名的{type}目录下的文件。

注意：Ant 风格的路径模式语法中的特殊字符需要转义，如：

- 要匹配文件路径中的星号，则需要转义为\\*。
- 要匹配文件路径中的问号，则需要转义为\\?。
- path风格的双星（**）不能放在中间

#### 模式切换

**AntPathMatcher 与 `PathPatternParser`**

- PathPatternParser 在 jmh 基准测试下，有 6~8 倍吞吐量提升，降低 30%~40%空间分配率
- PathPatternParser 兼容 AntPathMatcher语法，并支持更多类型的路径模式
- PathPatternParser  "***\***" **多段匹配**的支持**仅允许在模式末尾使用**

```java
    @GetMapping("/a*/b?/{p1:[a-f]+}")
    public String hello(HttpServletRequest request, 
                        @PathVariable("p1") String path) {

        log.info("路径变量p1： {}", path);
        //获取请求路径
        String uri = request.getRequestURI();
        return uri;
    }
```

总结： 

- 使用默认的路径匹配规则，是由 PathPatternParser  提供的
- 如果路径中间需要有 **，替换成ant风格路径

```properties
# 改变路径匹配策略：
# ant_path_matcher 老版策略；
# path_pattern_parser 新版策略；
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```



### Rest映射

开启 Rest 功能

```yaml
spring:
  mvc:
    hiddenmethod:
      filter:
        enabled: true   #开启页面表单的Rest功能

```

源码分析，注入了 HiddenHttpMethodFilte 解析 Rest 风格的访问：

```java
public class WebMvcAutoConfiguration {
    @Bean
	@ConditionalOnMissingBean(HiddenHttpMethodFilter.class)
	@ConditionalOnProperty(prefix = "spring.mvc.hiddenmethod.filter", name = "enabled")
	public OrderedHiddenHttpMethodFilter hiddenHttpMethodFilter() {
		return new OrderedHiddenHttpMethodFilter();
	}
}

```

详细源码解析：SpringMVC → 基本操作 → Restful → 识别原理

Web 部分源码详解：SpringMVC → 运行原理



## 内容协商

一套系统适配多端数据返回

![1689331670591](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1689331670591.png)

### 多端内容适配

#### 默认规则

**pringBoot 多端内容适配**。

​	基于**请求头**内容协商：（默认开启）

​		客户端向服务端发送请求，携带HTTP标准的**Accept请求头**。

​			**Accept**: `application/json`、`text/xml`、`text/yaml`

​			服务端根据客户端**请求头期望的数据类型**进行**动态返回**

​	基于**请求参数**内容协商：（需要开启）

​		发送请求 GET /projects/spring-boot?format=json 

​		匹配到 @GetMapping("/projects/spring-boot") 

​		根据**参数协商**，优先返回 json 类型数据【**需要开启参数匹配设置**】

​		发送请求 GET /projects/spring-boot?format=xml,优先返回 xml 类型数据



#### 效果演示

请求同一个接口，可以返回json和xml不同格式数据

1. 引入支持写出xml内容依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

  2.标注注解

```java
@JacksonXmlRootElement  // 可以写出为xml文档
@Data
public class Person {
    private Long id;
    private String userName;
    private String email;
    private Integer age;
}

```

​	3.开启基于请求参数的内容协商

```properties
# 开启基于请求参数的内容协商功能。 默认参数名：format。 默认此功能不开启
spring.mvc.contentnegotiation.favor-parameter=true
# 指定内容协商时使用的参数名。默认是 format
spring.mvc.contentnegotiation.parameter-name=type
```

​	4.效果

![1689331803006](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1689331803006.png)
  ![1689331877460](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1689331877460.png)



------

#### 配置协商规则与支持类型

1. 修改**内容协商方式**

   ```properties
   #使用参数进行内容协商
   spring.mvc.contentnegotiation.favor-parameter=true  
   #自定义参数名，默认为format
   spring.mvc.contentnegotiation.parameter-name=myparam 
   ```

   

2. 大多数 MediaType 都是开箱即用的。也可以**自定义内容类型，如：**

   ```properties
   spring.mvc.contentnegotiation.media-types.yaml=text/yaml
   ```

### 自定义内容返回

#### 增加yaml返回支持

导入依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-yaml</artifactId>
</dependency>
```

把对象写出成YAML

```java
    public static void main(String[] args) throws JsonProcessingException {
        Person person = new Person();
        person.setId(1L);
        person.setUserName("张三");
        person.setEmail("aaa@qq.com");
        person.setAge(18);

        YAMLFactory factory = new YAMLFactory().disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);
        ObjectMapper mapper = new ObjectMapper(factory);

        String s = mapper.writeValueAsString(person);
        System.out.println(s);
    }    public static void main(String[] args) throws JsonProcessingException {
        Person person = new Person();
        person.setId(1L);
        person.setUserName("张三");
        person.setEmail("aaa@qq.com");
        person.setAge(18);

        YAMLFactory factory = new YAMLFactory().disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);
        ObjectMapper mapper = new ObjectMapper(factory);

        String s = mapper.writeValueAsString(person);
        System.out.println(s);
    }
```

编写配置

```properties
#新增一种媒体类型
spring.mvc.contentnegotiation.media-types.yaml=text/yaml#新增一种媒体类型
```

增加`HttpMessageConverter`组件，专门负责把对象写出为yaml格式

```java
    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override //配置一个能把对象转为yaml的messageConverter
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(new MyYamlHttpMessageConverter());
            }
        };
    }    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override //配置一个能把对象转为yaml的messageConverter
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(new MyYamlHttpMessageConverter());
            }
        };
    }
```

#### 如何增加其他

- 配置媒体类型支持: 

- - `spring.mvc.contentnegotiation.media-types.yaml=text/yaml`

- 编写对应的`HttpMessageConverter`，要告诉Boot这个支持的媒体类型

- - 按照3的示例

- 把MessageConverter组件加入到底层

- - 容器中放一个``WebMvcConfigurer`` 组件，并配置底层的`MessageConverter`

### 内容协商原理-`HttpMessageConverter`

- `HttpMessageConverter` 怎么工作？合适工作？
- 定制 `HttpMessageConverter`  来实现多端内容协商
- 编写`WebMvcConfigurer`提供的`configureMessageConverters`底层，修改底层的`MessageConverter`

#### `@ResponseBody`由`HttpMessageConverter`处理

标注了`@ResponseBody`的返回值 将会由支持它的 `HttpMessageConverter`写给浏览器

1. 如果controller方法的返回值标注了 `@ResponseBody `注解

1. 1. 请求进来先来到`DispatcherServlet`的`doDispatch()`进行处理
   2. 找到一个 `HandlerAdapter `适配器。利用适配器执行目标方法
   3. `RequestMappingHandlerAdapter`来执行，调用`invokeHandlerMethod（）`来执行目标方法
   4. 目标方法执行之前，准备好两个东西

1. 1. 1. `HandlerMethodArgumentResolver`：参数解析器，确定目标方法每个参数值
      2. `HandlerMethodReturnValueHandler`：返回值处理器，确定目标方法的返回值改怎么处理

1. 1. `RequestMappingHandlerAdapter` 里面的`invokeAndHandle()`真正执行目标方法
   2. 目标方法执行完成，会返回**返回值对象**
   3. **找到一个合适的返回值处理器** `HandlerMethodReturnValueHandler`
   4. 最终找到 `RequestResponseBodyMethodProcessor`能处理 标注了 `@ResponseBody`注解的方法
   5. `RequestResponseBodyMethodProcessor` 调用`writeWithMessageConverters `,利用`MessageConverter`把返回值写出去

上面解释：`@ResponseBody`由`HttpMessageConverter`处理

1. `HttpMessageConverter` 会**先进行内容协商**

1. 1. 遍历所有的`MessageConverter`看谁支持这种**内容类型的数据**
   2. 默认`MessageConverter`有以下
   3. ![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689386582798.png)
   4. 最终因为要`json`所以`MappingJackson2HttpMessageConverter`支持写出json
   5. jackson用`ObjectMapper`把对象写出去



#### `WebMvcAutoConfiguration`提供几种默认`HttpMessageConverters`

- `EnableWebMvcConfiguration`通过 `addDefaultHttpMessageConverters`添加了默认的`MessageConverter`；如下：

- - `ByteArrayHttpMessageConverter`： 支持字节数据读写
  - `StringHttpMessageConverter`： 支持字符串读写
  - `ResourceHttpMessageConverter`：支持资源读写
  - `ResourceRegionHttpMessageConverter`: 支持分区资源写出
  - `AllEncompassingFormHttpMessageConverter`：支持表单xml/json读写
  - `MappingJackson2HttpMessageConverter`： 支持请求响应体Json读写

默认8个：

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689386582809.png)

系统提供默认的MessageConverter 功能有限，仅用于json或者普通返回数据。额外增加新的内容协商功能，必须增加新的`HttpMessageConverter`



### 内嵌容器

SpringBoot 嵌入式 Servlet 容器，默认支持的 WebServe：Tomcat、Jetty、Undertow，管理、运行**Servlet组件**（Servlet、Filter、Listener）的环境，一般指**服务器**

#### 自动配置原理

- SpringBoot 默认嵌入Tomcat作为Servlet容器。
- **自动配置类**是`ServletWebServerFactoryAutoConfiguration`，`EmbeddedWebServerFactoryCustomizerAutoConfiguration`
- 自动配置类开始分析功能。`xxxxAutoConfiguration`

```java
@AutoConfiguration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
		ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
		ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
		ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
    
}@AutoConfiguration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
		ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
		ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
		ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
    
}
```

1. `ServletWebServerFactoryAutoConfiguration` 自动配置了嵌入式容器场景
2. 绑定了`ServerProperties`配置类，所有和服务器有关的配置 `server`
3. `ServletWebServerFactoryAutoConfiguration` 导入了 嵌入式的三大服务器 `Tomcat`、`Jetty`、`Undertow`

4. 1. 导入 `Tomcat`、`Jetty`、`Undertow` 都有条件注解。系统中有这个类才行（也就是导了包）
   2. 默认  `Tomcat`配置生效。给容器中放 TomcatServletWebServerFactory
   3. 都给容器中 `ServletWebServerFactory`放了一个 **web服务器工厂（造web服务器的）**
   4. **web服务器工厂 都有一个功能，**`getWebServer`获取web服务器
   5. TomcatServletWebServerFactory 创建了 tomcat。

5. ServletWebServerFactory 什么时候会创建 webServer出来。
6. `ServletWebServerApplicationContext`ioc容器，启动的时候会调用创建web服务器
7. Spring**容器刷新（启动）**的时候，会预留一个时机，刷新子容器。`onRefresh()`
8. refresh() 容器刷新 十二大步的刷新子容器会调用 `onRefresh()`；

```java
	@Override
	protected void onRefresh() {
		super.onRefresh();
		try {
			createWebServer();
		}
		catch (Throwable ex) {
			throw new ApplicationContextException("Unable to start web server", ex);
		}
	}	@Override
	protected void onRefresh() {
		super.onRefresh();
		try {
			createWebServer();
		}
		catch (Throwable ex) {
			throw new ApplicationContextException("Unable to start web server", ex);
		}
	}
```

Web场景的Spring容器启动，在onRefresh的时候，会调用创建web服务器的方法。

Web服务器的创建是通过WebServerFactory搞定的。容器中又会根据导了什么包条件注解，启动相关的 服务器配置，默认`EmbeddedTomcat`会给容器中放一个 `TomcatServletWebServerFactory`，导致项目启动，自动创建出Tomcat。





#### 自定义

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689673614218.png)

切换服务器；

```xml
<properties>
    <servlet-api.version>3.1.0</servlet-api.version>
</properties>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- Exclude the Tomcat dependency -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- Use Jetty instead -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency><properties>
    <servlet-api.version>3.1.0</servlet-api.version>
</properties>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- Exclude the Tomcat dependency -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- Use Jetty instead -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```



#### 最佳实践

**用法：**

- 修改`server`下的相关配置就可以修改**服务器参数**
- 通过给容器中放一个`**ServletWebServerFactory**`，来禁用掉SpringBoot默认放的服务器工厂，实现自定义嵌入**任意服务器**。



------



### 自定义

#### 定制规则

```java
@Configuration
public class MyWebMvcConfigurer implements WebMvcConfigurer {
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            //进行一些方法重写，来实现自定义的规则
            //比如添加一些解析器和拦截器，就是对原始容器功能的增加
        }
    }
    //也可以不加 @Bean，直接从这里重写方法进行功能增加
}

```



------



### 全面接管SpringMvc

@EnableWebMvc：全面接管 SpringMVC，所有规则全部自己重新配置

- @EnableWebMvc + WebMvcConfigurer + @Bean  全面接管SpringMVC
- @Import(DelegatingWebMvcConfiguration.**class**)，该类继承 WebMvcConfigurationSupport，自动配置了一些非常底层的组件，只能保证 SpringMVC 最基本的使用

原理：自动配置类 **WebMvcAutoConfiguration** 里面的配置要能生效，WebMvcConfigurationSupport 类不能被加载，所以 @EnableWebMvc 导致配置类失效，从而接管了 SpringMVC

```java
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
public class WebMvcAutoConfiguration {}

```

注意：一般不适用此注解

#### WebMvcAutoConfiguration 到底自动配置了哪些规则

SpringMVC自动配置场景给我们配置了如下所有**默认行为**

1. `WebMvcAutoConfiguration`web场景的自动配置类

1. 1. 支持RESTful的filter：HiddenHttpMethodFilter
   2. 支持非POST请求，请求体携带数据：FormContentFilter
   3. 导入`**EnableWebMvcConfiguration**`：

1. 1. 1. `RequestMappingHandlerAdapter`
      2. `WelcomePageHandlerMapping`： **欢迎页功能**支持（模板引擎目录、静态资源目录放index.html），项目访问/ 就默认展示这个页面.
      3. `RequestMappingHandlerMapping`：找每个请求由谁处理的映射关系
      4. `ExceptionHandlerExceptionResolver`：默认的异常解析器 
      5. `LocaleResolver`：国际化解析器
      6. `ThemeResolver`：主题解析器
      7. `FlashMapManager`：临时数据共享
      8. `FormattingConversionService`： 数据格式化 、类型转化
      9. `Validator`： 数据校验`JSR303`提供的数据校验功能
      10. `WebBindingInitializer`：请求参数的封装与绑定
      11. `ContentNegotiationManager`：内容协商管理器

1. 1. `**WebMvcAutoConfigurationAdapter**`配置生效，它是一个`WebMvcConfigurer`，定义mvc底层组件

1. 1. 1. 定义好 `WebMvcConfigurer` **底层组件默认功能；所有功能详见列表**
      2. 视图解析器：`InternalResourceViewResolver`
      3. 视图解析器：`BeanNameViewResolver`,**视图名（controller方法的返回值字符串）**就是组件名
      4. 内容协商解析器：`ContentNegotiatingViewResolver`
      5. 请求上下文过滤器：`RequestContextFilter`: 任意位置直接获取当前请求
      6. 静态资源链规则
      7. `ProblemDetailsExceptionHandler`：错误详情

1. 1. 1. 1. SpringMVC内部场景异常被它捕获：

1. 1. 定义了MVC默认的底层行为: `WebMvcConfigurer`





#### @EnableWebMvc 禁用默认行为

1. `@EnableWebMvc`给容器中导入 `DelegatingWebMvcConfiguration`组件，

​        他是 `WebMvcConfigurationSupport`

1. `WebMvcAutoConfiguration`有一个核心的条件注解, `@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)`，容器中没有`WebMvcConfigurationSupport`，`WebMvcAutoConfiguration`才生效.
2. @EnableWebMvc 导入 `WebMvcConfigurationSupport` 导致 `WebMvcAutoConfiguration` 失效。导致禁用了默认行为



- @EnableWebMVC 禁用了 Mvc的自动配置
- WebMvcConfigurer 定义SpringMVC底层组件的功能类



#### WebMvcConfigurer 功能

定义扩展SpringMVC底层功能

| 提供方法                           | 核心参数                                | 功能                                                         | 默认                                                         |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| addFormatters                      | FormatterRegistry                       | **格式化器**：支持属性上@NumberFormat和@DatetimeFormat的数据类型转换 | GenericConversionService                                     |
| getValidator                       | 无                                      | **数据校验**：校验 Controller 上使用@Valid标注的参数合法性。需要导入starter-validator | 无                                                           |
| addInterceptors                    | InterceptorRegistry                     | **拦截器**：拦截收到的所有请求                               | 无                                                           |
| configureContentNegotiation        | ContentNegotiationConfigurer            | **内容协商**：支持多种数据格式返回。需要配合支持这种类型的HttpMessageConverter | 支持 json                                                    |
| configureMessageConverters         | List<HttpMessageConverter<?>>           | **消息转换器**：标注@ResponseBody的返回值会利用MessageConverter直接写出去 | 8 个，支持byte，string,multipart,resource，json              |
| addViewControllers                 | ViewControllerRegistry                  | **视图映射**：直接将请求路径与物理视图映射。用于无 java 业务逻辑的直接视图页渲染 | 无 <mvc:view-controller>                                     |
| configureViewResolvers             | ViewResolverRegistry                    | **视图解析器**：逻辑视图转为物理视图                         | ViewResolverComposite                                        |
| addResourceHandlers                | ResourceHandlerRegistry                 | **静态资源处理**：静态资源路径映射、缓存控制                 | ResourceHandlerRegistry                                      |
| configureDefaultServletHandling    | DefaultServletHandlerConfigurer         | **默认 Servlet**：可以覆盖 Tomcat 的DefaultServlet。让DispatcherServlet拦截/ | 无                                                           |
| configurePathMatch                 | PathMatchConfigurer                     | **路径匹配**：自定义 URL 路径匹配。可以自动为所有路径加上指定前缀，比如 /api | 无                                                           |
| configureAsyncSupport              | AsyncSupportConfigurer                  | **异步支持**：                                               | TaskExecutionAutoConfiguration                               |
| addCorsMappings                    | CorsRegistry                            | **跨域**：                                                   | 无                                                           |
| addArgumentResolvers               | `List<HandlerMethodArgumentResolver>`   | **参数解析器**：                                             | mvc 默认提供                                                 |
| addReturnValueHandlers             | `List<HandlerMethodReturnValueHandler>` | **返回值解析器**：                                           | mvc 默认提供                                                 |
| configureHandlerExceptionResolvers | `List<HandlerExceptionResolver>`        | **异常处理器**：                                             | 默认 3 个 ExceptionHandlerExceptionResolver ResponseStatusExceptionResolver DefaultHandlerExceptionResolver |
| getMessageCodesResolver            | 无                                      | **消息码解析器**：国际化使用                                 | 无                                                           |



## Web新特性

### Problemdetails

RFC 7807: <https://www.rfc-editor.org/rfc/rfc7807>

**错误信息**返回新格式

原理

```java
@Configuration(proxyBeanMethods = false)
//配置过一个属性 spring.mvc.problemdetails.enabled=true
@ConditionalOnProperty(prefix = "spring.mvc.problemdetails", name = "enabled", havingValue = "true")
static class ProblemDetailsErrorHandlingConfiguration {

    @Bean
    @ConditionalOnMissingBean(ResponseEntityExceptionHandler.class)
    ProblemDetailsExceptionHandler problemDetailsExceptionHandler() {
        return new ProblemDetailsExceptionHandler();
    }

}@Configuration(proxyBeanMethods = false)

```

1. `ProblemDetailsExceptionHandler `是一个 `@ControllerAdvice`集中处理系统异常
2. 处理以下异常。如果系统出现以下异常，会被SpringBoot支持以 `RFC 7807`规范方式返回错误数据

```java
	@ExceptionHandler({
			HttpRequestMethodNotSupportedException.class, //请求方式不支持
			HttpMediaTypeNotSupportedException.class,
			HttpMediaTypeNotAcceptableException.class,
			MissingPathVariableException.class,
			MissingServletRequestParameterException.class,
			MissingServletRequestPartException.class,
			ServletRequestBindingException.class,
			MethodArgumentNotValidException.class,
			NoHandlerFoundException.class,
			AsyncRequestTimeoutException.class,
			ErrorResponseException.class,
			ConversionNotSupportedException.class,
			TypeMismatchException.class,
			HttpMessageNotReadableException.class,
			HttpMessageNotWritableException.class,
			BindException.class
		})	
```





效果：

默认响应错误的json。状态码 405

```json
{
    "timestamp": "2023-04-18T11:13:05.515+00:00",
    "status": 405,
    "error": "Method Not Allowed",
    "trace": "org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'POST' is not supported\r\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.handleNoMatch(RequestMappingInfoHandlerMapping.java:265)\r\n\tat org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.lookupHandlerMethod(AbstractHandlerMethodMapping.java:441)\r\n\tat org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.getHandlerInternal(AbstractHandlerMethodMapping.java:382)\r\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:126)\r\n\tat org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping.getHandlerInternal(RequestMappingInfoHandlerMapping.java:68)\r\n\tat org.springframework.web.servlet.handler.AbstractHandlerMapping.getHandler(AbstractHandlerMapping.java:505)\r\n\tat org.springframework.web.servlet.DispatcherServlet.getHandler(DispatcherServlet.java:1275)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1057)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:974)\r\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1011)\r\n\tat org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:914)\r\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:563)\r\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:885)\r\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:631)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:205)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149)\r\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149)\r\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149)\r\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149)\r\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149)\r\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:166)\r\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90)\r\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)\r\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)\r\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93)\r\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)\r\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:341)\r\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:390)\r\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63)\r\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:894)\r\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1741)\r\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)\r\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\r\n\tat java.base/java.lang.Thread.run(Thread.java:833)\r\n",
    "message": "Method 'POST' is not supported.",
    "path": "/list"
}
```





开启ProblemDetails返回, 使用新的MediaType

`Content-Type: application/problem+json`+ 额外扩展返回

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689733828782.png)

```json
{
    "type": "about:blank",
    "title": "Method Not Allowed",
    "status": 405,
    "detail": "Method 'POST' is not supported.",
    "instance": "/list"
}
```

### 函数式Web

`SpringMVC 5.2` 以后 允许我们使用**函数式**的方式，**定义Web的请求处理流程**。

函数式接口

Web请求处理的方式：

1. `@Controller + @RequestMapping`：**耦合式** （**路由**、**业务**耦合）
2. **函数式Web**：分离式（路由、业务分离）



#### 场景

场景：User RESTful - CRUD

- GET /user/1  获取1号用户
- GET /users   获取所有用户
- POST /user  **请求体**携带JSON，新增一个用户
- PUT /user/1 **请求体**携带JSON，修改1号用户
- DELETE /user/1 **删除**1号用户 

#### 核心类

- **RouterFunction**
- **RequestPredicate**
- **ServerRequest**
- **ServerResponse**

#### 示例

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RequestPredicate;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RequestPredicates.accept;
import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration(proxyBeanMethods = false)
public class MyRoutingConfiguration {

    private static final RequestPredicate ACCEPT_JSON = accept(MediaType.APPLICATION_JSON);

    @Bean
    public RouterFunction<ServerResponse> routerFunction(MyUserHandler userHandler) {
        return route()
                .GET("/{user}", ACCEPT_JSON, userHandler::getUser)
                .GET("/{user}/customers", ACCEPT_JSON, userHandler::getUserCustomers)
                .DELETE("/{user}", ACCEPT_JSON, userHandler::deleteUser)
                .build();
    }

}


```

```java
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class MyUserHandler {

    public ServerResponse getUser(ServerRequest request) {
        ...
        return ServerResponse.ok().build();
    }

    public ServerResponse getUserCustomers(ServerRequest request) {
        ...
        return ServerResponse.ok().build();
    }

    public ServerResponse deleteUser(ServerRequest request) {
        ...
        return ServerResponse.ok().build();
    }

}
```



------



## 模板引擎

# 

- 由于 **SpringBoot** 使用了**嵌入式 Servlet 容器**。所以 **JSP** 默认是**不能使用**的。
- 如果需要**服务端页面渲染**，优先考虑使用 模板引擎。

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1689395843025.png)

模板引擎页面默认放在 src/main/resources/templates

**SpringBoot** 包含以下模板引擎的自动配置

- FreeMarker
- Groovy
- **Thymeleaf**
- Mustache

**Thymeleaf官网**：<https://www.thymeleaf.org/> 

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
	<title>Good Thymes Virtual Grocery</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="stylesheet" type="text/css" media="all" th:href="@{/css/gtvg.css}" />
</head>
<body>
	<p th:text="#{home.welcome}">Welcome to our grocery store!</p>
</body
</html>
```

### Thymeleaf整合

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

自动配置原理

1. 开启了 org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration 自动配置
2. 属性绑定在 ThymeleafProperties 中，对应配置文件 spring.thymeleaf 内容
3. 所有的模板页面默认在 `classpath:/templates`文件夹下
4. 默认效果

5. 1. 所有的模板页面在 `classpath:/templates/`下面找
   2. 找后缀名为`.html`的页面



### 基础语法

#### 核心用法

`th:xxx`**：动态渲染指定的 html 标签属性值、或者th指令（遍历、判断等）**

- `th:text`：标签体内文本值渲染

- - `th:utext`：不会转义，显示为html原本的样子。

- `th:属性`：标签指定属性渲染
- `th:attr`：标签任意属性渲染
- `th:if``th:each``...`：其他th指令
- 例如：

```html
<p th:text="${content}">原内容</p>
<a th:href="${url}">登录</a>
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

`表达式`**：用来动态取值**

- `${}`**：变量取值；使用model共享给页面的值都直接用${}**
- `@{}`**：url路径；**
- `#{}`：国际化消息
- `~{}`：片段引用
- `*{}`：变量选择：需要配合th:object绑定对象

**系统工具&内置对象：**[**详细文档**](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#appendix-a-expression-basic-objects)

- `param`：请求参数对象
- `session`：session对象
- `application`：application对象
- `#execInfo`：模板执行信息
- `#messages`：国际化消息
- `#uris`：uri/url工具
- `#conversions`：类型转换工具
- `#dates`：日期工具，是`java.util.Date`对象的工具类
- `#calendars`：类似#dates，只不过是`java.util.Calendar`对象的工具类
- `#temporals`： JDK8+ `**java.time**` API 工具类
- `#numbers`：数字操作工具
- `#strings`：字符串操作
- `#objects`：对象操作
- `#bools`：bool操作
- `#arrays`：array工具
- `#lists`：list工具
- `#sets`：set工具
- `#maps`：map工具
- `#aggregates`：集合聚合工具（sum、avg）
- `#ids`：id生成工具

### 语法示例

**表达式：**

- 变量取值：${...}
- url 取值：@{...}
- 国际化消 #{...}
- 变量选择：*{...}
- 片段引用: ~{...}

**常见：**

- 文本： 'one text'，'another one!',...
- 数字： 0,34,3.0,12.3,...
- 布尔：true、false
- null: null
- 变量名： one,sometext,main...

**文本操作：**

- 拼串： +  
- 文本替换：| The name is ${name} |

**布尔操作：**

- 二进制运算： and,or
- 取反：!,not

**比较运算：**

- 比较：>，<，<=，>=（gt，lt，ge,le）
- 等值运算：==,!=（eq，ne）

**条件运算：**

- if-then： (if)?(then)
- if-then-else: (if)?(then):(else)
- default: (value)?:(defaultValue)

**特殊语法：**

- 无操作：_

**所有以上都可以嵌套组合**

```plain
'User is of type ' + (${user.isAdmin()} ? 'Administrator' : (${user.type} ?: 'Unknown'))'User is of type ' + (${user.isAdmin()} ? 'Administrator' : (${user.type} ?: 'Unknown'))
```



### 属性设置

1. th:href="@{/product/list}"
2. th:attr="class=${active}"
3. th:attr="src=@{/images/gtvglogo.png},title=${logo},alt=#{logo}"
4. th:checked="${user.active}"

```html
<p th:text="${content}">原内容</p>
<a th:href="${url}">登录</a>
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

### 遍历

语法：  `th:each="元素名,迭代状态 : ${集合}"`

```html
<tr th:each="prod : ${prods}">
  <td th:text="${prod.name}">Onions</td>
  <td th:text="${prod.price}">2.41</td>
  <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>

<tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
  <td th:text="${prod.name}">Onions</td>
  <td th:text="${prod.price}">2.41</td>
  <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>
```

iterStat 有以下属性：

- index：当前遍历元素的索引，从0开始
- count：当前遍历元素的索引，从1开始
- size：需要遍历元素的总数量
- current：当前正在遍历的元素对象
- even/odd：是否偶数/奇数行
- first：是否第一个元素
- last：是否最后一个元素



### 判断

### th:if

如果为true，该代码才生效

```html
<a
  href="comments.html"
  th:href="@{/product/comments(prodId=${prod.id})}"
  th:if="${not #lists.isEmpty(prod.comments)}"
   >view</a>
```



### th:switch

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
  <p th:case="*">User is some other thing</p>
</div>
```



### 属性优先级

- 片段
- 遍历
- 判断

```html
<ul>
  <li th:each="item : ${items}" th:text="${item.description}">Item description here...</li>
</ul>
```

| Order | Feature          | Attributes                           |
| ----- | ---------------- | ------------------------------------ |
| 1     | 片段包含         | th:insert th:replace                 |
| 2     | 遍历             | th:each                              |
| 3     | 判断             | th:if th:unless th:switch th:case    |
| 4     | 定义本地变量     | th:object th:with                    |
| 5     | 通用方式属性修改 | th:attr th:attrprepend th:attrappend |
| 6     | 指定属性修改     | th:value th:href th:src ...          |
| 7     | 文本值           | th:text th:utext                     |
| 8     | 片段指定         | th:fragment                          |
| 9     | 片段移除         | th:remove                            |



###  变量选择

```html
<div th:object="${session.user}">
  <p>Name: <span th:text="*{firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="*{lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="*{nationality}">Saturn</span>.</p>
</div>
```

等同于

```html
<div>
  <p>Name: <span th:text="${session.user.firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="${session.user.nationality}">Saturn</span>.</p>
</div>
```



###  模板布局

- 定义模板： `th:fragment`
- 引用模板：`~{templatename::selector}`
- 插入模板：`th:insert`、`th:replace`

```html
<footer th:fragment="copy">&copy; 2011 The Good Thymes Virtual Grocery</footer>

<body>
  <div th:insert="~{footer :: copy}"></div>
  <div th:replace="~{footer :: copy}"></div>
</body>
<body>
  结果：
  <body>
    <div>
      <footer>&copy; 2011 The Good Thymes Virtual Grocery</footer>
    </div>

    <footer>&copy; 2011 The Good Thymes Virtual Grocery</footer>
  </body>
</body>
```



### devtools

```xml
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
      </dependency> 
```

修改前端页面后；`ctrl+F9`刷新效果；

java代码的修改，如果`devtools`热启动了，可能会引起一些bug，难以排查

## 国际化

国际化的自动配置参照`MessageSourceAutoConfiguration`

**实现步骤**：

1. Spring Boot 在类路径根下查找messages资源绑定文件。文件名为：messages.properties
2. 多语言可以定义多个消息文件，命名为`messages_区域代码.properties`。如：

3. 1. `messages.properties`：默认
   2. `messages_zh_CN.properties`：中文环境
   3. `messages_en_US.properties`：英语环境

4. 在**程序中**可以自动注入 `MessageSource`组件，获取国际化的配置项值
5. 在**页面中**可以使用表达式 ` #{}`获取国际化的配置项值

```java
    @Autowired  //国际化取消息用的组件
    MessageSource messageSource;
    @GetMapping("/haha")
    public String haha(HttpServletRequest request){

        Locale locale = request.getLocale();
        //利用代码的方式获取国际化配置文件中指定的配置项的值，login是配置文件里面的属性，null是一个数组，locale代表区域信息
        String login = messageSource.getMessage("login", null, locale);
        return login;
    }
    @Autowired  //国际化取消息用的组件
    MessageSource messageSource;
    @GetMapping("/haha")
    public String haha(HttpServletRequest request){

        Locale locale = request.getLocale();
        //利用代码的方式获取国际化配置文件中指定的配置项的值
        String login = messageSource.getMessage("login", null, locale);
        return login;
    }
```



## 错误处理

### 默认机制

**错误处理的自动配置**都在`ErrorMvcAutoConfiguration`中，两大核心机制：

- \1. SpringBoot 会**自适应****处理错误**，**响应页面**或**JSON数据**
- \2. **SpringMVC的错误处理机制**依然保留，**MVC处理不了**，才会**交给boot进行处理**

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE.svg)





- 发生错误以后，转发给/error路径，SpringBoot在底层写好一个 BasicErrorController的组件，专门处理这个请求

```java
	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE) //返回HTML
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
			.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

	@RequestMapping  //返回 ResponseEntity, JSON
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		HttpStatus status = getStatus(request);
		if (status == HttpStatus.NO_CONTENT) {
			return new ResponseEntity<>(status);
		}
		Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
		return new ResponseEntity<>(body, status);
	}	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE) //返回HTML
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
			.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

	@RequestMapping  //返回 ResponseEntity, JSON
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		HttpStatus status = getStatus(request);
		if (status == HttpStatus.NO_CONTENT) {
			return new ResponseEntity<>(status);
		}
		Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
		return new ResponseEntity<>(body, status);
	}
```

- 错误页面是这么解析到的

```java
//1、解析错误的自定义视图地址
ModelAndView modelAndView = resolveErrorView(request, response, status, model);
//2、如果解析不到错误页面的地址，默认的错误页就是 error
return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);//1、解析错误的自定义视图地址
ModelAndView modelAndView = resolveErrorView(request, response, status, model);
//2、如果解析不到错误页面的地址，默认的错误页就是 error
return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
```



容器中专门有一个错误视图解析器

```java
@Bean
@ConditionalOnBean(DispatcherServlet.class)
@ConditionalOnMissingBean(ErrorViewResolver.class)
DefaultErrorViewResolver conventionErrorViewResolver() {
    return new DefaultErrorViewResolver(this.applicationContext, this.resources);
}@Bean
@ConditionalOnBean(DispatcherServlet.class)
@ConditionalOnMissingBean(ErrorViewResolver.class)
DefaultErrorViewResolver conventionErrorViewResolver() {
    return new DefaultErrorViewResolver(this.applicationContext, this.resources);
}
```

SpringBoot解析自定义错误页的默认规则

```java
	@Override
	public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
		ModelAndView modelAndView = resolve(String.valueOf(status.value()), model);
		if (modelAndView == null && SERIES_VIEWS.containsKey(status.series())) {
			modelAndView = resolve(SERIES_VIEWS.get(status.series()), model);
		}
		return modelAndView;
	}

	private ModelAndView resolve(String viewName, Map<String, Object> model) {
		String errorViewName = "error/" + viewName;
		TemplateAvailabilityProvider provider = this.templateAvailabilityProviders.getProvider(errorViewName,
				this.applicationContext);
		if (provider != null) {
			return new ModelAndView(errorViewName, model);
		}
		return resolveResource(errorViewName, model);
	}

	private ModelAndView resolveResource(String viewName, Map<String, Object> model) {
		for (String location : this.resources.getStaticLocations()) {
			try {
				Resource resource = this.applicationContext.getResource(location);
				resource = resource.createRelative(viewName + ".html");
				if (resource.exists()) {
					return new ModelAndView(new HtmlResourceView(resource), model);
				}
			}
			catch (Exception ex) {
			}
		}
		return null;
	}	@Override
	public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
		ModelAndView modelAndView = resolve(String.valueOf(status.value()), model);
		if (modelAndView == null && SERIES_VIEWS.containsKey(status.series())) {
			modelAndView = resolve(SERIES_VIEWS.get(status.series()), model);
		}
		return modelAndView;
	}

	private ModelAndView resolve(String viewName, Map<String, Object> model) {
		String errorViewName = "error/" + viewName;
		TemplateAvailabilityProvider provider = this.templateAvailabilityProviders.getProvider(errorViewName,
				this.applicationContext);
		if (provider != null) {
			return new ModelAndView(errorViewName, model);
		}
		return resolveResource(errorViewName, model);
	}

	private ModelAndView resolveResource(String viewName, Map<String, Object> model) {
		for (String location : this.resources.getStaticLocations()) {
			try {
				Resource resource = this.applicationContext.getResource(location);
				resource = resource.createRelative(viewName + ".html");
				if (resource.exists()) {
					return new ModelAndView(new HtmlResourceView(resource), model);
				}
			}
			catch (Exception ex) {
			}
		}
		return null;
	}
```



容器中有一个默认的名为 error 的 view； 提供了默认白页功能

```java
@Bean(name = "error")
@ConditionalOnMissingBean(name = "error")
public View defaultErrorView() {
    return this.defaultErrorView;
}@Bean(name = "error")
@ConditionalOnMissingBean(name = "error")
public View defaultErrorView() {
    return this.defaultErrorView;
}
```



封装了JSON格式的错误信息

```java
	@Bean
	@ConditionalOnMissingBean(value = ErrorAttributes.class, search = SearchStrategy.CURRENT)
	public DefaultErrorAttributes errorAttributes() {
		return new DefaultErrorAttributes();
	}	@Bean
	@ConditionalOnMissingBean(value = ErrorAttributes.class, search = SearchStrategy.CURRENT)
	public DefaultErrorAttributes errorAttributes() {
		return new DefaultErrorAttributes();
	}
```





规则：

1. **解析一个错误页**

1. 1. 如果发生了500、404、503、403 这些错误

1. 1. 1. 如果有**模板引擎**，默认在 `classpath:/templates/error/**精确码.html**`
      2. 如果没有模板引擎，在静态资源文件夹下找  `**精确码.html**`

1. 1. 如果匹配不到`精确码.html`这些精确的错误页，就去找`5xx.html`，`4xx.html`**模糊匹配**

1. 1. 1. 如果有模板引擎，默认在 `classpath:/templates/error/5xx.html`
      2. 如果没有模板引擎，在静态资源文件夹下找  `5xx.html`

1. 如果模板引擎路径`templates`下有 `error.html`页面，就直接渲染



### 自定义错误响应

#### 自定义json响应

使用@ControllerAdvice + @ExceptionHandler 进行统一异常处理

#### 自定义页面响应

根据boot的错误页面规则，自定义页面模板



### 最佳实战

- **前后分离**

- - 后台发生的所有错误，`@ControllerAdvice + @ExceptionHandler`进行统一异常处理。

- **服务端页面渲染**

- - **不可预知的一些，HTTP码表示的服务器或客户端错误**

- - - 给`classpath:/templates/error/`下面，放常用精确的错误码页面。`500.html`，`404.html`
    - 给`classpath:/templates/error/`下面，放通用模糊匹配的错误码页面。 `5xx.html`，`4xx.html`

- - **发生业务错误**

- - - **核心业务**，每一种错误，都应该代码控制，**跳转到自己定制的错误页**。
    - **通用业务**，`classpath:/templates/error.html`页面，**显示错误信息**。

页面，JSON，可用的Model数据如下

![1689603288292](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1689603288292.png)



## 数据访问

### JDBC

#### 基本使用

导入 starter：

```xml
<!--导入 JDBC 场景-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
<!--导入 MySQL 驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <!--版本对应你的 MySQL 版本<version>5.1.49</version>-->
</dependency>

```

单独导入 MySQL 驱动是因为不确定用户使用的什么数据库

配置文件：

```yaml
spring:
  datasource:
    url: jdbc:mysql://192.168.0.107:3306/db1?useSSL=false	# 不加 useSSL 会警告
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver

```

测试文件：

```java
@Slf4j
@SpringBootTest
class Boot05WebAdminApplicationTests {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void contextLoads() {
        Long res = jdbcTemplate.queryForObject("select count(*) from account_tbl", Long.class);
        log.info("记录总数：{}", res);
    }
}

```





------



#### 自动配置

DataSourceAutoConfiguration：数据源的自动配置

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
	@Conditional(PooledDataSourceCondition.class) 
	@ConditionalOnMissingBean({ DataSource.class, XADataSource.class })
	@Import({ DataSourceConfiguration.Hikari.class, DataSourceConfiguration.Tomcat.class,
			DataSourceConfiguration.Dbcp2.class, DataSourceConfiguration.OracleUcp.class})
	protected static class PooledDataSourceConfiguration {}
}
// 配置项
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties implements BeanClassLoaderAware, InitializingBean {}

```

- 底层默认配置好的连接池是：**HikariDataSource**
- 数据库连接池的配置，是容器中没有 DataSource 才自动配置的
- 修改数据源相关的配置：spring.datasource

相关配置：

- DataSourceTransactionManagerAutoConfiguration： 事务管理器的自动配置
- JdbcTemplateAutoConfiguration： JdbcTemplate 的自动配置
  - 可以修改这个配置项 @ConfigurationProperties(prefix = **"spring.jdbc"**) 来修改JdbcTemplate
  - `@AutoConfigureAfter(DataSourceAutoConfiguration.class)`：在 DataSource 装配后装配
- JndiDataSourceAutoConfiguration： jndi 的自动配置
- XADataSourceAutoConfiguration： 分布式事务相关





------



### Druid

导入坐标：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.17</version>
</dependency>

```

```java
@Configuration
@ConditionalOnClass(DruidDataSource.class)
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
@EnableConfigurationProperties({DruidStatProperties.class, DataSourceProperties.class})
@Import({DruidSpringAopConfiguration.class,
    DruidStatViewServletConfiguration.class,
    DruidWebStatFilterConfiguration.class,
    DruidFilterConfiguration.class})
public class DruidDataSourceAutoConfigure {}

```

自动配置：

- 扩展配置项 **spring.datasource.druid**
- DruidSpringAopConfiguration： 监控 SpringBean，配置项为 `spring.datasource.druid.aop-patterns`
- DruidStatViewServletConfiguration：监控页的配置项为 `spring.datasource.druid.stat-view-servlet`，默认开启
- DruidWebStatFilterConfiguration：Web 监控配置项为 `spring.datasource.druid.web-stat-filter`，默认开启
- DruidFilterConfiguration：所有 Druid 自己 filter 的配置

配置示例：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db_account
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver

    druid:
      aop-patterns: com.atguigu.admin.*  #监控SpringBean
      filters: stat,wall     # 底层开启功能，stat（sql监控），wall（防火墙）

      stat-view-servlet:   # 配置监控页功能
        enabled: true
        login-username: admin	#项目启动访问：http://localhost:8080/druid ，账号和密码是 admin
        login-password: admin
        resetEnable: false

      web-stat-filter:  # 监控web
        enabled: true
        urlPattern: /*
        exclusions: '*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*'


      filter:
        stat:    # 对上面filters里面的stat的详细配置
          slow-sql-millis: 1000
          logSlowSql: true
          enabled: true
        wall:
          enabled: true
          config:
            drop-table-allow: false

```



配置示例：https://github.com/alibaba/druid/tree/master/druid-spring-boot-starter

配置项列表：https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8



------



### MyBatis

#### 基本使用

导入坐标：

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>

```

- 编写 MyBatis 相关配置：application.yml

  ```yaml
  # 配置mybatis规则
  mybatis:
  #  config-location: classpath:mybatis/mybatis-config.xml  建议不写
    mapper-locations: classpath:mybatis/mapper/*.xml
    configuration:
      map-underscore-to-camel-case: true
      
   #可以不写全局配置文件，所有全局配置文件的配置都放在 configuration 配置项中即可
  
  ```

- 定义表和实体类

  ```java
  public class User {
      private int id;
      private String username;
      private String password;
  }
  
  ```

- 编写 dao 和 mapper 文件/纯注解开发

  dao：**@Mapper 注解必须加，使用自动装配的 package，否则在启动类指定 @MapperScan() 扫描路径（不建议）**

  ```java
  @Mapper  //必须加Mapper
  @Repository
  public interface UserXmlMapper {
      public List<User> findAll();
  }
  
  ```

  mapper.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  <mapper namespace="com.seazean.springbootmybatis.mapper.UserXmlMapper">
      <select id="findAll" resultType="user">
          select * from t_user
      </select>
  </mapper>
  
  ```

- 纯注解开发

  ```java
  @Mapper
  @Repository
  public interface UserMapper {
      @Select("select * from t_user")
      public List<User> findAll();
  }
  
  ```



------



#### 自动配置

MybatisAutoConfiguration：

```java
@EnableConfigurationProperties(MybatisProperties.class)	//MyBatis配置项绑定类。
@AutoConfigureAfter({ DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class })
public class MybatisAutoConfiguration {
    @Bean
  	@ConditionalOnMissingBean
  	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    	SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        return factory.getObject();
    }
    
    @org.springframework.context.annotation.Configuration
   	@Import(AutoConfiguredMapperScannerRegistrar.class)
   	@ConditionalOnMissingBean({ MapperFactoryBean.class, MapperScannerConfigurer.class })
   	public static class MapperScannerRegistrarNotFoundConfiguration implements InitializingBean {}
}

@ConfigurationProperties(prefix = "mybatis")
public class MybatisProperties {}

```

- 配置文件：`mybatis`
- 自动配置了 SqlSessionFactory
- 导入 `AutoConfiguredMapperScannerRegistra` 实现 @Mapper 的扫描



------



#### MyBatis-Plus

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.1</version>
</dependency>

```

自动配置类：MybatisPlusAutoConfiguration 

只需要 Mapper 继承 **BaseMapper** 就可以拥有 CRUD 功能



------



### Redis

#### 基本使用

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

```

- 配置redis相关属性

  ```yaml
  spring:
    redis:
      host: 127.0.0.1 # redis的主机ip
      port: 6379
  
  ```

- 注入 RedisTemplate 模板

  ```java
  @RunWith(SpringRunner.class)
  @SpringBootTest
  public class SpringbootRedisApplicationTests {
      @Autowired
      private RedisTemplate redisTemplate;
  
      @Test
      public void testSet() {
          //存入数据
          redisTemplate.boundValueOps("name").set("zhangsan");
      }
      @Test
      public void testGet() {
          //获取数据
          Object name = redisTemplate.boundValueOps("name").get();
          System.out.println(name);
      }
  }
  
  ```



------



#### 自动配置

RedisAutoConfiguration 自动配置类

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(name = "redisTemplate")
    @ConditionalOnSingleCandidate(RedisConnectionFactory.class)
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnSingleCandidate(RedisConnectionFactory.class)
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

}

```

- 配置项：`spring.redis`
- 自动导入了连接工厂配置类：LettuceConnectionConfiguration、JedisConnectionConfiguration
- 自动注入了模板类：RedisTemplate<Object, Object> 、StringRedisTemplate，k v 都是 String 类型
- 使用 @Autowired 注入模板类就可以操作 redis



------

## 整合SSM场景

SpringBoot 整合 `Spring`、`SpringMVC`、`MyBatis` 进行**数据访问场景**开发

创建SSM整合项目

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.1</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```



### 配置数据源

```properties
spring.datasource.url=jdbc:mysql://192.168.200.100:3306/demo
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
```

安装MyBatisX 插件，帮我们生成Mapper接口的xml文件即可

### 配置MyBatis

```properties
#指定mapper映射文件位置
mybatis.mapper-locations=classpath:/mapper/*.xml
#参数项调整
mybatis.configuration.map-underscore-to-camel-case=true
```



### CRUD编写

- 编写Bean
- 编写Mapper
- 使用`mybatisx`插件，快速生成MapperXML
- 测试CRUD



### 自动配置原理

**SSM整合总结：**

1. **导入** `mybatis-spring-boot-starter`
2. 配置**数据源**信息
3. 配置mybatis的`**mapper接口扫描**`与`**xml映射文件扫描**`
4. 编写bean，mapper，生成xml，编写sql 进行crud。**事务等操作依然和Spring中用法一样**
5. 效果：

6. 1. 所有sql写在xml中
   2. 所有`mybatis配置`写在`application.properties`下面



- `jdbc场景的自动配置`： 

- - `mybatis-spring-boot-starter`导入 `spring-boot-starter-jdbc`，jdbc是操作数据库的场景
  - `Jdbc`场景的几个自动配置

- - - org.springframework.boot.autoconfigure.jdbc.**DataSourceAutoConfiguration**

- - - - **数据源的自动配置**
      - 所有和数据源有关的配置都绑定在`DataSourceProperties`
      - 默认使用 `HikariDataSource`

- - - org.springframework.boot.autoconfigure.jdbc.**JdbcTemplateAutoConfiguration**

- - - - 给容器中放了`JdbcTemplate`操作数据库

- - - org.springframework.boot.autoconfigure.jdbc.**JndiDataSourceAutoConfiguration**
    - org.springframework.boot.autoconfigure.jdbc.**XADataSourceAutoConfiguration**

- - - - **基于XA二阶提交协议的分布式事务数据源**

- - - org.springframework.boot.autoconfigure.jdbc.**DataSourceTransactionManagerAutoConfiguration**

- - - - **支持事务**

- - **具有的底层能力：数据源、**`JdbcTemplate`、**事务**





- `MyBatisAutoConfiguration`：配置了MyBatis的整合流程

- - `mybatis-spring-boot-starter`导入 `mybatis-spring-boot-autoconfigure（mybatis的自动配置包）`，
  - 默认加载两个自动配置类：

- - - org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration
    - org.mybatis.spring.boot.autoconfigure.**MybatisAutoConfiguration**

- - - - **必须在数据源配置好之后才配置**
      - 给容器中`SqlSessionFactory`组件。创建和数据库的一次会话
      - 给容器中`SqlSessionTemplate`组件。操作数据库

- - **MyBatis的所有配置绑定在**`MybatisProperties`
  - 每个**Mapper接口**的**代理对象**是怎么创建放到容器中。详见**@MapperScan**原理：

- - - 利用`@Import(MapperScannerRegistrar.class)`批量给容器中注册组件。解析指定的包路径里面的每一个类，为每一个Mapper接口类，创建Bean定义信息，注册到容器中。





如何分析哪个场景导入以后，开启了哪些自动配置类。

找：`classpath:/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件中配置的所有值，就是要开启的自动配置类，但是每个类可能有条件注解，基于条件注解判断哪个自动配置类生效了。



### 快速定位生效的配置

```plain
#开启调试模式，详细打印开启了哪些自动配置
debug=true
# Positive（生效的自动配置）  Negative（不生效的自动配置）
```



### 扩展：整合其他数据源

#### Druid 数据源

暂不支持 `SpringBoot3`

- 导入`druid-starter`
- 写配置
- 分析自动配置了哪些东西，怎么用

Druid官网：<https://github.com/alibaba/druid>

```properties
#数据源基本配置
spring.datasource.url=jdbc:mysql://192.168.200.100:3306/demo
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource

# 配置StatFilter监控
spring.datasource.druid.filter.stat.enabled=true
spring.datasource.druid.filter.stat.db-type=mysql
spring.datasource.druid.filter.stat.log-slow-sql=true
spring.datasource.druid.filter.stat.slow-sql-millis=2000
# 配置WallFilter防火墙
spring.datasource.druid.filter.wall.enabled=true
spring.datasource.druid.filter.wall.db-type=mysql
spring.datasource.druid.filter.wall.config.delete-allow=false
spring.datasource.druid.filter.wall.config.drop-table-allow=false
# 配置监控页，内置监控页面的首页是 /druid/index.html
spring.datasource.druid.stat-view-servlet.enabled=true
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=admin
spring.datasource.druid.stat-view-servlet.allow=*

# 其他 Filter 配置不再演示
# 目前为以下 Filter 提供了配置支持，请参考文档或者根据IDE提示（spring.datasource.druid.filter.*）进行配置。
# StatFilter
# WallFilter
# ConfigFilter
# EncodingConvertFilter
# Slf4jLogFilter
# Log4jFilter
# Log4j2Filter
# CommonsLogFilter
```

```
CREATE TABLE `t_user`
(
    `id`         BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '编号',
    `login_name` VARCHAR(200) NULL DEFAULT NULL COMMENT '用户名称' COLLATE 'utf8_general_ci',
    `nick_name`  VARCHAR(200) NULL DEFAULT NULL COMMENT '用户昵称' COLLATE 'utf8_general_ci',
    `passwd`     VARCHAR(200) NULL DEFAULT NULL COMMENT '用户密码' COLLATE 'utf8_general_ci',
    PRIMARY KEY (`id`)
);
insert into t_user(login_name, nick_name, passwd) VALUES ('zhangsan','张三','123456');
```



### 附录：示例数据库

```sql
CREATE TABLE `t_user`
(
    `id`         BIGINT(20)   NOT NULL AUTO_INCREMENT COMMENT '编号',
    `login_name` VARCHAR(200) NULL DEFAULT NULL COMMENT '用户名称' COLLATE 'utf8_general_ci',
    `nick_name`  VARCHAR(200) NULL DEFAULT NULL COMMENT '用户昵称' COLLATE 'utf8_general_ci',
    `passwd`     VARCHAR(200) NULL DEFAULT NULL COMMENT '用户密码' COLLATE 'utf8_general_ci',
    PRIMARY KEY (`id`)
);
insert into t_user(login_name, nick_name, passwd) VALUES ('zhangsan','张三','123456');
```



## **SpringBoot3-基础特性**

### SpringApplication

#### 自定义 banner

1. 类路径添加banner.txt或设置spring.banner.location就可以定制 banner

```properties
pring.banner.location=classpath:banner.txt
spring.main.banner-mode=off //不显示banner
```



  2.推荐网站：[Spring Boot banner 在线生成工具，制作下载英文 banner.txt，修改替换 banner.txt 文字实现自定义，个性化启动 banner-bootschool.net](https://www.bootschool.net/ascii)

#### 自定义 SpringApplication

```java
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(MyApplication.class);
        application.setBannerMode(Banner.Mode.OFF);
        application.run(args);
    }

}
```

#### FluentBuilder API（流式api）

```java
new SpringApplicationBuilder()
    .main(Boot306FeaturesApplication.class)
    .sources(Boot306FeaturesApplication.class)
    //spring
    .properties("server.port=8888","aaaa=bbbb")
    .bannerMode(Banner.Mode.CONSOLE)
    .run(args);
```



### Profiles

环境隔离能力；快速切换开发、测试、生产环境

步骤：

1. **标识环境**：指定哪些组件、配置在哪个环境生效
2. **切换环境**：这个环境对应的所有组件和配置就应该生效

#### 使用

#### 指定环境

- Spring Profiles 提供一种**隔离配置**的方式，使其仅在**特定环境**生效；
- 任何@Component, @Configuration 或 @ConfigurationProperties 可以使用 @Profile 标记，来指定何时被加载。【**容器中的组件**都可以被 `@Profile`标记】



#### 环境激活

1. 配置激活指定环境； 配置文件

```properties
spring.profiles.active=production,hsqldb
```

1. 也可以使用命令行激活。--spring.profiles.active=dev,hsqldb
2. 还可以配置**默认环境**； 不标注@Profile 的组件永远都存在。

3. 1. 以前默认环境叫default
   2. `spring.profiles.default=test`

4. 推荐使用激活方式激活指定环境





#### 环境包含

注意：

1. spring.profiles.active 和spring.profiles.default 只能用到 **无 profile 的配置文件**中，如果在application-dev.yaml中编写就是**无效的**
2. 也可以额外添加生效文件，而不是激活替换。比如：

```properties
spring.profiles.include=dev,test
spring.profiles.include[0]=common
spring.profiles.include[1]=local
```



最佳实战：

- **生效的环境** = **激活的环境/默认环境**  + **包含的环境**
- 项目里面这么用

- - 基础的配置`mybatis`、`log`、`xxx`：写到**包含环境中**
  - 需要动态切换变化的 `db`、`redis`：写到**激活的环境中**

####  Profile 分组

创建prod组，指定包含db和mq配置

```plain
spring.profiles.group.prod[0]=db
spring.profiles.group.prod[1]=mq
```

使用--spring.profiles.active=prod ，就会激活prod，db，mq配置文件



####  Profile 配置文件

- `application-{profile}.properties`可以作为**指定环境的配置文件**。
- 激活这个环境，**配置**就会生效。最终生效的所有**配置**是

- - `application.properties`：主配置文件，任意时候都生效
  - `application-{profile}.properties`：指定环境配置文件，激活指定环境生效

项目的所有生效配置项 = 激活环境配置文件的所有项 + 主配置文江和激活文件不冲突的所有项，如果发生了配置冲突，以激活的环境配置文件为准。

## 外部化配置

**场景**：线上应用如何**快速修改配置**，并应**用最新配置**？

- SpringBoot 使用  **配置优先级** + **外部配置**  简化配置更新、简化运维。
- 只需要给`jar`应用所在的文件夹放一个`application.properties`最新配置文件，重启项目就能自动应用最新配置



### 配置优先级

Spring Boot 允许将**配置外部化**，以便可以在不同的环境中使用相同的应用程序代码。

我们可以使用各种**外部配置源**，包括Java Properties文件、YAML文件、环境变量和命令行参数。

@Value可以获取值，也可以用@ConfigurationProperties将所有属性绑定到java object中

**以下是 SpringBoot 属性源加载顺序。**后面的会覆盖前面的值。由低到高，高优先级配置覆盖低优先级

1. **默认属性**（通过`SpringApplication.setDefaultProperties`指定的）
2. @PropertySource指定加载的配置（需要写在@Configuration类上才可生效）
3. **配置文件（**application.properties/yml等）
4. RandomValuePropertySource支持的random.*配置（如：@Value("${random.int}")）
5. OS 环境变量
6. Java 系统属性（System.getProperties()）
7. JNDI 属性（来自java:comp/env）
8. ServletContext 初始化参数
9. ServletConfig 初始化参数
10. SPRING_APPLICATION_JSON属性（内置在环境变量或系统属性中的 JSON）
11. **命令行参数**
12. 测试属性。(@SpringBootTest进行测试时指定的属性)
13. 测试类@TestPropertySource注解
14. Devtools 设置的全局属性。($HOME/.config/spring-boot)

结论：配置可以写到很多位置，常见的优先级顺序：

- `命令行`> `配置文件`> `springapplication配置`



**配置文件优先级**如下：(**后面覆盖前面**)

1. **jar 包内**的application.properties/yml
2. **jar 包内**的application-{profile}.properties/yml
3. **jar 包外**的application.properties/yml
4. **jar 包外**的application-{profile}.properties/yml

**建议**：**用一种格式的配置文件**。`**如果****.properties****和****.yml****同时存在,则****.properties****优先**`

结论：`包外 > 包内`； 同级情况：`profile配置 > application配置`

**所有参数均可由命令行传入，使用**`**--参数项=参数值**`**，将会被添加到环境变量中，并优先于**`**配置文件**`**。**

**比如**`**java -jar app.jar --name="Spring"**`**,可以使用**`**@Value("${name}")**`**获取**



演示场景：

- 包内： application.properties   `server.port=8000`
- 包内： application-dev.properties    `server.port=9000`
- 包外：  application.properties   `server.port=8001`
- 包外： application-dev.properties    `server.port=9001`

启动端口？：命令行 > `9001` > `8001` > `9000` > `8000`



### 外部配置

SpringBoot 应用启动时会自动寻找application.properties和application.yaml位置，进行加载。顺序如下：（**后面覆盖前面**）

1. 类路径: 内部

1. 1. 类根路径
   2. 类下/config包

1. 当前路径（项目所在的位置）

1. 1. 当前路径
   2. 当前下/config子目录
   3. /config目录的直接子目录



最终效果：优先级由高到低，前面覆盖后面

- 命令行 > 包外config直接子目录 > 包外config目录 > 包外根目录 > 包内目录
- 同级比较： 

- - profile配置 > 默认配置
  - properties配置 > yaml配置

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%BB%98%E5%9B%BE-1689991518453.svg)



规律：最外层的最优先。

- 命令行 > 所有
- 包外 > 包内
- config目录 > 根目录
- profile > application 

配置不同就都生效（互补），配置相同高优先级覆盖低优先级

### 导入配置

使用spring.config.import可以导入额外配置

```plain
spring.config.import=classpath:/my.properties
my.property=value
```

无论以上写法的先后顺序，my.properties的值总是优先于直接在文件中编写的my.property。



### 属性占位符

配置文件中可以使用 ${name:default}形式取出之前配置过的值。

```properties
app.name=MyApp
app.description=${app.name} is a Spring Boot application written by ${username:Unknown}
```







## 单元测试

### Junit5

Spring Boot 2.2.0 版本开始引入 JUnit 5 作为单元测试默认库，由三个不同的子模块组成：

- JUnit Platform：在 JVM 上启动测试框架的基础，不仅支持 Junit 自制的测试引擎，其他测试引擎也可以接入

- JUnit Jupiter：提供了 JUnit5 的新的编程模型，是 JUnit5 新特性的核心，内部包含了一个测试引擎，用于在 Junit Platform 上运行

- JUnit Vintage：JUnit Vintage 提供了兼容 JUnit4.x、Junit3.x 的测试引擎

  注意：SpringBoot 2.4 以上版本移除了默认对 Vintage 的依赖，如果需要兼容 Junit4 需要自行引入

```java
@SpringBootTest
class Boot05WebAdminApplicationTests {
    @Test
    void contextLoads() { }
}

```



------



### 常用注解

JUnit5 的注解如下：

- @Test：表示方法是测试方法，但是与 JUnit4 的 @Test 不同，它的职责非常单一不能声明任何属性，拓展的测试将会由 Jupiter 提供额外测试，包是 `org.junit.jupiter.api.Test`
- @ParameterizedTest：表示方法是参数化测试
- @RepeatedTest：表示方法可重复执行
- @DisplayName：为测试类或者测试方法设置展示名称，支持表情符号
- @BeforeEach：表示在每个单元测试之前执行
- @AfterEach：表示在每个单元测试之后执行
- @BeforeAll：表示在所有单元测试之前执行
- @AfterAll：表示在所有单元测试之后执行
- @Tag：表示单元测试类别，类似于 JUnit4 中的 @Categories
- @Disabled：表示测试类或测试方法不执行，类似于 JUnit4 中的 @Ignore
- @Timeout：表示测试方法运行如果超过了指定时间将会返回错误
- @ExtendWith：为测试类或测试方法提供扩展类引用



------



### 断言机制

#### 简单断言

断言（assertions）是测试方法中的核心，用来对测试需要满足的条件进行验证，断言方法都是 org.junit.jupiter.api.Assertions 的静态方法

用来对单个值进行简单的验证：

| 方法              | 说明                                 |
| ----------------- | ------------------------------------ |
| assertEquals      | 判断两个对象或两个原始类型是否相等   |
| assertNotEquals   | 判断两个对象或两个原始类型是否不相等 |
| assertSame        | 判断两个对象引用是否指向同一个对象   |
| assertNotSame     | 判断两个对象引用是否指向不同的对象   |
| assertTrue        | 判断给定的布尔值是否为 true          |
| assertFalse       | 判断给定的布尔值是否为 false         |
| assertNull        | 判断给定的对象引用是否为 null        |
| assertNotNull     | 判断给定的对象引用是否不为 null      |
| assertArrayEquals | 数组断言                             |
| assertAll         | 组合断言                             |
| assertThrows      | 异常断言                             |
| assertTimeout     | 超时断言                             |
| fail              | 快速失败                             |

```java
@Test
@DisplayName("simple assertion")
public void simple() {
     assertEquals(3, 1 + 2, "simple math");
     assertNull(null);
     assertNotNull(new Object());
}

```



------



#### 数组断言

通过 assertArrayEquals 方法来判断两个对象或原始类型的数组是否相等

```java
@Test
@DisplayName("array assertion")
public void array() {
 	assertArrayEquals(new int[]{1, 2}, new int[] {1, 2});
}

```



------



#### 组合断言

assertAll 方法接受多个 org.junit.jupiter.api.Executable 函数式接口的实例作为验证的断言，可以通过 lambda 表达式提供这些断言

```java
@Test
@DisplayName("assert all")
public void all() {
	assertAll("Math",
              () -> assertEquals(2, 1 + 1),
              () -> assertTrue(1 > 0)
   	);
}

```



------



#### 异常断言

Assertions.assertThrows()，配合函数式编程就可以进行使用

```java
@Test
@DisplayName("异常测试")
public void exceptionTest() {
    ArithmeticException exception = Assertions.assertThrows(
        //扔出断言异常
		ArithmeticException.class, () -> System.out.println(1 / 0)
    );
}
```



------



#### 超时断言

Assertions.assertTimeout() 为测试方法设置了超时时间

```java
@Test
@DisplayName("超时测试")
public void timeoutTest() {
    //如果测试方法时间超过1s将会异常
    Assertions.assertTimeout(Duration.ofMillis(1000), () -> Thread.sleep(500));
}
```



------



#### 快速失败

通过 fail 方法直接使得测试失败

```java
@Test
@DisplayName("fail")
public void shouldFail() {
	fail("This should fail");
}

```





------



### 前置条件

JUnit 5 中的前置条件（assumptions）类似于断言，不同之处在于**不满足的断言会使得测试方法失败**，而不满足的**前置条件只会使得测试方法的执行终止**，前置条件可以看成是测试方法执行的前提，当该前提不满足时，就没有继续执行的必要

```java
@DisplayName("测试前置条件")
@Test
void testassumptions(){
    Assumptions.assumeTrue(false,"结果不是true");
    System.out.println("111111");

}

```



------



### 嵌套测试

JUnit 5 可以通过 Java 中的内部类和 @Nested 注解实现嵌套测试，从而可以更好的把相关的测试方法组织在一起，在内部类中可以使用 @BeforeEach 和 @AfterEach 注解，而且嵌套的层次没有限制

```java
@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        assertNull(stack)
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            assertThrows(EmptyStackException.class, stack::pop);
        }
    }
}

```





------



### 参数测试

参数化测试是 JUnit5 很重要的一个新特性，它使得用不同的参数多次运行测试成为了可能

利用**@ValueSource**等注解，指定入参，我们将可以使用不同的参数进行多次单元测试，而不需要每新增一个参数就新增一个单元测试，省去了很多冗余代码。

- @ValueSource：为参数化测试指定入参来源，支持八大基础类以及 String 类型、Class 类型
- @NullSource：表示为参数化测试提供一个 null 的入参
- @EnumSource：表示为参数化测试提供一个枚举入参
- @CsvFileSource：表示读取指定 CSV 文件内容作为参数化测试入参
- @MethodSource：表示读取指定方法的返回值作为参数化测试入参（注意方法返回需要是一个流）





------

# SpringBoot3-核心原理

# 事件和监听器

## 生命周期监听

场景：监听**应用**的**生命周期**

###  监听器-SpringApplicationRunListener

自定义`SpringApplicationRunListener`来**监听事件**；

​	编写`SpringApplicationRunListener` **实现类**

​		在 `META-INF/spring.factories` 中配置 `org.springframework.boot.SpringApplicationRunListener=自己的Listener`，还可以指定一个**有参构造器**，接受两个参数`(SpringApplication application, String[] args)`

​	springboot 在`spring-boot.jar`中配置了默认的 Listener，如下

```properties
org.springframework.boot.SpringApplicationRunListener=\
org.springframework.boot.context.event.EventPublishingRunListener
```



```java
/**
 * Listener先要从 META-INF/spring.factories 读到
 *
 * 1、引导： 利用 BootstrapContext 引导整个项目启动
 *      starting：              应用开始，SpringApplication的run方法一调用，只要有了 BootstrapContext 就执行
 *      environmentPrepared：   环境准备好（把启动参数等绑定到环境变量中），但是ioc还没有创建；【调一次】
 * 2、启动：
 *      contextPrepared：       ioc容器创建并准备好，但是sources（主配置类）没加载。并关闭引导上下文；组件都没创建  【调一次】
 *      contextLoaded：         ioc容器加载。主配置类加载进去了。但是ioc容器还没刷新（我们的bean没创建）。
 *      =======截止以前，ioc容器里面还没造bean呢=======
 *      started：               ioc容器刷新了（所有bean造好了），但是 runner 没调用。
 *      ready:                  ioc容器刷新了（所有bean造好了），所有 runner 调用完了。
 * 3、运行
 *     以前步骤都正确执行，代表容器running。
 */
```



### 生命周期全流程

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1690014353078.png)

## 事件触发时机

### 	各种回调监听器

- `BootstrapRegistryInitializer`：    **感知特定阶段：**感知**引导初始化**

- - `META-INF/spring.factories`
  - 创建引导上下文`bootstrapContext`的时候触发。
  - application.`addBootstrapRegistryInitializer`();
  - 场景：`进行密钥校对授权。`

- ApplicationContextInitializer：   **感知特定阶段：** 感知ioc容器初始化

- - `META-INF/spring.factories`
  - application.addInitializers();

- **ApplicationListener：    感知全阶段：基于事件机制，感知事件。 一旦到了哪个阶段可以做别的事**

- - `@Bean`或`@EventListener`： `事件驱动`
  - `SpringApplication.addListeners(…)`或 `SpringApplicationBuilder.listeners(…)`
  - `META-INF/spring.factories`

- **SpringApplicationRunListener：       感知全阶段生命周期 + 各种阶段都能自定义操作； 功能更完善。**

- - `META-INF/spring.factories`

- **ApplicationRunner:          感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪**

- - `@Bean`

- **CommandLineRunner：   感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪**

- - `@Bean`





最佳实战：

- 如果项目启动前做事： `BootstrapRegistryInitializer` 和 `ApplicationContextInitializer`
- 如果想要在项目启动完成后做事：`**ApplicationRunner**`**和** `**CommandLineRunner**`
- **如果要干涉生命周期做事：**`**SpringApplicationRunListener**`
- **如果想要用事件机制：**`**ApplicationListener**`





###  完整触发流程

`**9大事件**`触发顺序&时机

1. `ApplicationStartingEvent`：应用启动但未做任何事情, 除过注册listeners and initializers.
2. `ApplicationEnvironmentPreparedEvent`：  Environment 准备好，但context 未创建.
3. `ApplicationContextInitializedEvent`: ApplicationContext 准备好，ApplicationContextInitializers 调用，但是任何bean未加载
4. `ApplicationPreparedEvent`： 容器刷新之前，bean定义信息加载
5. `ApplicationStartedEvent`： 容器刷新完成， runner未调用

=========以下就开始插入了**探针机制**============

1. `AvailabilityChangeEvent`： `LivenessState.CORRECT`应用存活； **存活探针**
2. `ApplicationReadyEvent`: 任何runner被调用
3. `AvailabilityChangeEvent`：`ReadinessState.ACCEPTING_TRAFFIC`**就绪探针**，可以接请求
4. `ApplicationFailedEvent `：启动出错

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1690014557542.png)



应用事件发送顺序如下：

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1690014557551.png)

感知应用是否**存活**了：可能植物状态，虽然活着但是不能处理请求。

应用是否**就绪**了：能响应请求，说明确实活的比较好。



###  SpringBoot 事件驱动开发

**应用启动过程生命周期事件感知（9大事件）**、**应用运行中事件感知（无数种）**。

- **事件发布**：`ApplicationEventPublisherAware`或`注入：ApplicationEventMulticaster`
- **事件监听**：`组件 + @EventListener`

![1690420642059](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1690420642059.png)

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/image-1690014616618.png)



事件发布者

```java
@Service
public class EventPublisher implements ApplicationEventPublisherAware {

    /**
     * 底层发送事件用的组件，SpringBoot会通过ApplicationEventPublisherAware接口自动注入给我们
     * 事件是广播出去的。所有监听这个事件的监听器都可以收到
     */
    ApplicationEventPublisher applicationEventPublisher;

    /**
     * 所有事件都可以发
     * @param event
     */
    public void sendEvent(ApplicationEvent event) {
        //调用底层API发送事件
        applicationEventPublisher.publishEvent(event);
    }

    /**
     * 会被自动调用，把真正发事件的底层组组件给我们注入进来
     * @param applicationEventPublisher event publisher to be used by this object
     */
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
}
```



事件订阅者

```java
@Service
public class CouponService {

    @Order(1)
    @EventListener
    public void onEvent(LoginSuccessEvent loginSuccessEvent){
        System.out.println("===== CouponService ====感知到事件"+loginSuccessEvent);
        UserEntity source = (UserEntity) loginSuccessEvent.getSource();
        sendCoupon(source.getUsername());
    }

    public void sendCoupon(String username){
        System.out.println(username + " 随机得到了一张优惠券");
    }
}
```

#  自动配置原理

##  入门理解

应用关注的**三大核心**：**场景**、**配置**、**组件**

### 自动配置流程

![1690420681025](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/1690420681025.png)

1. 导入`starter`
2. 依赖导入`autoconfigure`
3. 寻找类路径下 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件
4. 启动，加载所有 `自动配置类` `xxxAutoConfiguration`

5. 1. 给容器中配置**功能**`组件`
   2. `组件参数`绑定到 `属性类`中。`xxxProperties`
   3. `属性类`和`配置文件`前缀项绑定
   4. `@Contional派生的条件注解`进行判断**是否组件生效**

6. 效果：

7. 1. 修改配置文件，修改底层参数
   2. 所有场景自动配置好直接使用
   3. 可以注入SpringBoot配置好的组件随时使用



###  SPI机制

- **Java中的SPI（Service Provider Interface）是一种软件设计模式，用于****在应用程序中动态地发现和加载组件****。****SPI的思想**是，定义一个接口或抽象类，然后通过在classpath中定义实现该接口的类来实现对组件的动态发现和加载。
- SPI的主要目的是解决在应用程序中使用可插拔组件的问题。例如，一个应用程序可能需要使用不同的日志框架或数据库连接池，但是这些组件的选择可能取决于运行时的条件。通过使用SPI，应用程序可以在运行时发现并加载适当的组件，而无需在代码中硬编码这些组件的实现类。
- 在Java中，**SPI**的实现方式是通过在`META-INF/services`目录下创建一个以服务接口全限定名为名字的文件，文件中包含实现该服务接口的类的全限定名。当应用程序启动时，Java的SPI机制会自动扫描classpath中的这些文件，并根据文件中指定的类名来加载实现类。
- 通过使用SPI，应用程序可以实现更灵活、可扩展的架构，同时也可以避免硬编码依赖关系和增加代码的可维护性。

以上回答来自`ChatGPT-3.5`



### 功能开关

- 自动配置：全部都配置好，什么都不用管。   自动批量导入

- - 项目一启动，spi文件中指定的所有都加载。

- `@EnableXxxx`：手动控制哪些功能的开启； 手动导入。

- - 开启xxx功能
  - 都是利用 @Import 把此功能要用的组件导入进去



## 进阶理解

### @SpringBootApplication

#### 	@SpringBootConfiguration

就是： @Configuration ，容器中的组件，配置类。spring ioc启动就会加载创建这个类对象



#### 	@EnableAutoConfiguration：开启自动配置

开启自动配置

##### @AutoConfigurationPackage：扫描主程序包：加载自己的组件

- 利用 `@Import(AutoConfigurationPackages.Registrar.class)` 想要给容器中导入组件。
- 把主程序所在的**包**的所有组件导入进来。
- **为什么SpringBoot默认只扫描主程序所在的包及其子包**



##### @Import(AutoConfigurationImportSelector.class)：加载所有自动配置类：加载starter导入的组件

```java
		List<String> configurations = ImportCandidates.load(AutoConfiguration.class, getBeanClassLoader())
			.getCandidates();
```

扫描SPI文件：`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`



#### 	@ComponentScan

组件扫描：排除一些组件（哪些不要）

排除前面已经扫描进来的`配置类`、和`自动配置类`。

```plain
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
      @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
```



### 完整启动加载流程

生命周期启动加载流程

![img](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/springBoot/%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE%E8%BF%9B%E9%98%B6%E5%8E%9F%E7%90%86-1690014616633.svg)



#  自定义starter

场景：**抽取聊天机器人场景，它可以打招呼**。

效果：任何项目导入此`starter`都具有打招呼功能，并且**问候语**中的**人名**需要可以在**配置文件**中修改

- \1. 创建`自定义starter`项目，引入`spring-boot-starter`基础依赖
- \2. 编写模块功能，引入模块所有需要的依赖。
- \3. 编写`xxxAutoConfiguration`自动配置类，帮其他项目导入这个模块需要的所有组件
- \4. 编写配置文件`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`指定启动需要加载的自动配置
- \5. 其他项目引入即可使用





## 1. 业务代码

自定义配置有提示。导入以下依赖重启项目，再写配置文件就有提示

```java
@ConfigurationProperties(prefix = "robot")  //此属性类和配置文件指定前缀绑定
@Component
@Data
public class RobotProperties {

    private String name;
    private String age;
    private String email;
}
```



```xml
<!--        导入配置处理器，配置文件自定义的properties配置都会有提示-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
```



## 2. 基本抽取

- 创建starter项目，把公共代码需要的所有依赖导入
- 把公共代码复制进来
- 自己写一个 `RobotAutoConfiguration`，给容器中导入这个场景需要的所有组件

- - 为什么这些组件默认不会扫描进去？
  - **starter所在的包和 引入它的项目的主程序所在的包不是父子层级**

- 别人引用这个`starter`，直接导入这个 `RobotAutoConfiguration`,就能把这个场景的组件导入进来
- 功能生效。
- 测试编写配置文件



## 3. 使用@EnableXxx机制

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
@Import(RobotAutoConfiguration.class)
public @interface EnableRobot {


}
```

别人引入`starter`需要使用 `@EnableRobot`开启功能  

## 4. 完全自动配置

- 依赖SpringBoot的SPI机制
- META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件中编写好我们自动配置类的全类名即可
- 项目启动，自动加载我们的自动配置类



## 指标监控

### Actuator

每一个微服务在云上部署以后，都需要对其进行监控、追踪、审计、控制等，SpringBoot 抽取了 Actuator 场景，使得每个微服务快速引用即可获得生产级别的应用监控、审计等功能

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

```

暴露所有监控信息为 HTTP：

```yaml
management:
  endpoints:
    enabled-by-default: true #暴露所有端点信息
    web:
      exposure:
        include: '*'  #以web方式暴露

```

访问 http://localhost:8080/actuator/[beans/health/metrics/]

可视化界面：https://github.com/codecentric/spring-boot-admin



------



### Endpoint

默认所有的 Endpoint 除过 shutdown 都是开启的

```yaml
management:
  endpoints:
    enabled-by-default: false	#禁用所有的
  endpoint:						#手动开启一部分
    beans:
      enabled: true
    health:
      enabled: true

```

端点：

| ID                 | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `auditevents`      | 暴露当前应用程序的审核事件信息。需要一个 `AuditEventRepository` 组件 |
| `beans`            | 显示应用程序中所有 Spring Bean 的完整列表                    |
| `caches`           | 暴露可用的缓存                                               |
| `conditions`       | 显示自动配置的所有条件信息，包括匹配或不匹配的原因           |
| `configprops`      | 显示所有 `@ConfigurationProperties`                          |
| `env`              | 暴露 Spring 的属性 `ConfigurableEnvironment`                 |
| `flyway`           | 显示已应用的所有 Flyway 数据库迁移。 需要一个或多个 Flyway 组件。 |
| `health`           | 显示应用程序运行状况信息                                     |
| `httptrace`        | 显示 HTTP 跟踪信息，默认情况下 100 个 HTTP 请求-响应需要一个 `HttpTraceRepository` 组件 |
| `info`             | 显示应用程序信息                                             |
| `integrationgraph` | 显示 Spring integrationgraph，需要依赖 `spring-integration-core` |
| `loggers`          | 显示和修改应用程序中日志的配置                               |
| `liquibase`        | 显示已应用的所有 Liquibase 数据库迁移，需要一个或多个 Liquibase 组件 |
| `metrics`          | 显示当前应用程序的指标信息。                                 |
| `mappings`         | 显示所有 `@RequestMapping` 路径列表                          |
| `scheduledtasks`   | 显示应用程序中的计划任务                                     |
| `sessions`         | 允许从 Spring Session 支持的会话存储中检索和删除用户会话，需要使用 Spring Session 的基于 Servlet 的 Web 应用程序 |
| `shutdown`         | 使应用程序正常关闭，默认禁用                                 |
| `startup`          | 显示由 `ApplicationStartup` 收集的启动步骤数据。需要使用 `SpringApplication` 进行配置 `BufferingApplicationStartup` |
| `threaddump`       | 执行线程转储                                                 |

应用程序是 Web 应用程序（Spring MVC，Spring WebFlux 或 Jersey），则可以使用以下附加端点：

| ID           | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| `heapdump`   | 返回 `hprof` 堆转储文件。                                    |
| `jolokia`    | 通过 HTTP 暴露 JMX bean（需要引入 Jolokia，不适用于 WebFlux），需要引入依赖 `jolokia-core` |
| `logfile`    | 返回日志文件的内容（如果已设置 `logging.file.name` 或 `logging.file.path` 属性），支持使用 HTTP Range标头来检索部分日志文件的内容。 |
| `prometheus` | 以 Prometheus 服务器可以抓取的格式公开指标，需要依赖 `micrometer-registry-prometheus` |

常用 Endpoint：

- Health：监控状况
- Metrics：运行时指标
- Loggers：日志记录





------





## 项目部署

SpringBoot 项目开发完毕后，支持两种方式部署到服务器：

- jar 包 (官方推荐，默认)
- war 包

**更改 pom 文件中的打包方式为 war**

- 修改启动类

  ```java
  @SpringBootApplication
  public class SpringbootDeployApplication extends SpringBootServletInitializer {
      public static void main(String[] args) {
          SpringApplication.run(SpringbootDeployApplication.class, args);
      }
  
      @Override
      protected SpringApplicationBuilder configure(SpringApplicationBuilder b) {
          return b.sources(SpringbootDeployApplication.class);
      }
  }
  ```

- 指定打包的名称

  ```xml
  <packaging>war</packaging>
  <build>
       <finalName>springboot</finalName>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
           </plugin>
       </plugins>
  </build>
  ```



------

