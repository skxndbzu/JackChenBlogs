---
title: SpringSecurity
icon: pen-to-square
order: 4
date: 2022-01-01
category:
  - SpringSecurity
tag:
  - 授权
  - 登录校验

---



# SpringSecurity从入门到精通



## 1.简介

[Spring Security 中文文档 ](https://springdoc.cn/spring-security/)

Spring Security是一个Java框架，用于保护应用程序的安全性。它提供了一套全面的安全解决方案，包括身份验证、授权、防止攻击等功能。Spring Security基于过滤器链的概念，可以轻松地集成到任何基于Spring的应用程序中。它支持多种身份验证选项和授权策略，开发人员可以根据需要选择适合的方式。此外，Spring Security还提供了一些附加功能，如集成第三方身份验证提供商和单点登录，以及会话管理和密码编码等。总之，Spring Security是一个强大且易于使用的框架，可以帮助开发人员提高应用程序的安全性和可靠性。

一般Web应用的需要进行**认证**和**授权**。

**认证：验证当前访问系统的是不是本系统的用户，并且要确认具体是哪个用户**

**授权：经过认证后判断当前用户是否有权限进行某个操作**

而认证和授权也是SpringSecurity作为安全框架的核心功能



## 2.快速入门

你可以通过添加 `spring-boot-starter-security` 来为你的Spring Boot项目添加Spring Security。

1. **添加依赖**

```xml
<!--security依赖项目(重点)-->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-security</artifactId>
 </dependency>       

 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
 </dependency>
        
```

2. **启动类**

创建SpringBoo t项目时自动创建好了 此处我做了更改只是为了后期Debug

```java
@SpringBootApplication
public class SanGengSecurityApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(SanGengSecurityApplication.class, args);
        System.out.println("args = " + args);
    }

}
```

3. **创建Controller**

```java
@RestController
@RequestMapping("/hello")
public class HelloController {
    @GetMapping
    public String hello(){
        return "hello";
    }
}
```

4. **启动工程**

你可以在 `localhost:8080/` 访问该应用程序，这将使浏览器重定向到默认的登录页面。你可以提供 `user` 的默认用户名和随机生成的密码，这些密码会被记录到控制台中。然后浏览器会被带到最初请求的页面。

要注销，你可以访问 `localhost:8080/logout`，然后确认你想注销。

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510123227984.png" alt="image-20240510123227984" style="zoom: 50%;" />



> 输入默认账号:  user   密码在控制台打印了 

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510123511860.png" alt="image-20240510123511860" style="zoom:50%;" />





## 3.认证

### 3.1登录校验流程

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510123654190.png" alt="image-20240510123654190" style="zoom: 80%;" />

### 3.2原理初探

`SpringSecurity`的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。这里我们可以看看

入门案例中的过滤器。

![image-20240510123927556](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510123927556.png)

图中只展示了3个核心过滤器，其它的13个非核心过滤器并没有在图中展示。

**UsernamePasswordAuthenticationFilter**:负责处理我们在登陆页面填写了用户名密码后的登陆请求。入门案例的认证工作主要有它负责。

**ExceptionTranslationFilter**：处理过滤器链中抛出的任何AccessDeniedException和AuthenticationException 。

**FilterSecurityInterceptor**：负责权限校验的过滤器。

我们可以通过Debug查看当前系统中SpringSecurity过滤器链中有哪些过滤器及它们的顺序。

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510124139924.png" alt="image-20240510124139924" style="zoom:80%;" />



输入 `run.getBean(DefaultSecurityFilterChain.class)` 求值

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510124453646.png" alt="image-20240510124453646" style="zoom:67%;" />



### 3.3认证详流程详解

![image-20240715164704507](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240715164704507.png)

概念速查:

`Authentication`接口: 它的实现类，表示当前访问系统的用户，封装了用户相关信息。

`AuthenticationManager`接口：定义了认证Authentication的方法

`UserDetailsService`接口：加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的

方法。

`UserDetails`接口：提供核心用户信息。通过UserDetailsService根据用户名获取处理的用户信息要封装

成UserDetails对象返回。然后将这些信息封装到Authentication对象中



## 4.案例实战

### 4.1 思路分析

1. **自定义登录接口**

调用`ProviderManager`的方法进行认证 如果认证通过生成jwt

把用户信息存入redis中

> `SpringSecurity`在默认的认证过程中如果账号密码校验成功会返回Authentication对象之后`UsernamePasswordAuthenticationFilter`会将用户信息`Authentication`存入`SecurityContextHolder`中
>
> 但是我们在实际运用场景中认证通过后还需要向前端返回一个JSON格式的数据里面包括了JWT
>
> 所以此时我们需要写一个自定义登录接口

2. **自定义UserDetailsService接口**

在这个实现类中去查询数据库

校验：

定义Jwt认证过滤器

获取token

解析token获取其中的userid

从redis中获取用户信息

存入SecurityContextHolder

> `SpringSecurity` 默认是在内存中查找对应的用户名密码然后封装成`UserDetai`l对象交给`DaoAuthenticationProcider`校验
>
> 但是我们在实际运用场景中是从数据库中查找用户信息	
>
> 所以此时我们需要写一个`UserDetailsService`的实现类用来在数据库中查询用户信息并且封装到`UserDetai`l对象中



### 4.2准备工作

1.**添加依赖**(pom.xml)

```xml
        <!-- Spring Boot 安全功能的starter包，用于web应用的安全控制 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!-- Spring Boot Web功能的starter包，提供web应用的基本功能 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- Lombok，提供简单的代码生成工具，减少样板代码，设置为可选依赖 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!-- Spring Boot的测试starter包，用于单元测试和集成测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Security的测试包，用于安全测试 -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Redis的starter包，用于集成Redis作为缓存或持久化方案 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!-- FastJSON，一个Java语言编写的高性能功能完备的JSON库 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.33</version>
        </dependency>
        <!-- JWT（JSON Web Token）的库，用于生成和解析JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
        </dependency>
        <!-- JAXB API，用于XML和Java对象之间的绑定 -->
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.1</version>
        </dependency>
        <!-- MyBatis Plus的Spring Boot starter，用于简化MyBatis的使用 -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>3.5.5</version>
        </dependency>
        <!-- MySQL连接器，用于连接和操作MySQL数据库 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.29</version>
        </dependency>
        <!-- Spring Boot的测试starter包，重复项，可能用于不同目的 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
```



2.**添加Redis相关配置**(com.sangeng.utils | com.sangeng.config)

```java
public class FastJsonRedisSerializer<T> implements RedisSerializer<T> {
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");
    private Class<T> clazz;

    static {
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
    }

    public FastJsonRedisSerializer(Class<T> clazz) {
        super();
        this.clazz = clazz;
    }

    @Override
    public byte[] serialize(T t) throws SerializationException {
        if (t == null) {
            return new byte[0];
        }
        return JSON.toJSONString(t,
                SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length <= 0) {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);
        return JSON.parseObject(str, clazz);
    }

    protected JavaType getJavaType(Class<?> clazz) {
        return TypeFactory.defaultInstance().constructType(clazz);
    }
}
```

```java
@Configuration
public class RedisConfig {
    @Bean
    @SuppressWarnings(value = {"unchecked", "rawtypes"})
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory
                                                               connectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        FastJsonRedisSerializer serializer = new FastJsonRedisSerializer(Object.class);
        // 使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        // Hash的key也采用StringRedisSerializer的序列化方式
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        template.afterPropertiesSet();
        return template;
    }
}
```



3. **响应类**(com.sangeng.domain)

```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseResult<T> {
    /**
     * 状态码
     */
    private Integer code;
    /**
     * 提示信息，如果有错误时，前端可以获取该字段进行提示
     */
    private String msg;
    /**
     * 查询到的结果数据，
     */
    private T data;

    public ResponseResult(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public ResponseResult(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ResponseResult(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}

```



4. **工具类**(com.sangeng.utils)

```java
/**
 * JWT工具类
 */
public class JwtUtil {
    //有效期为
    public static final Long JWT_TTL = 60 * 60 * 1000L;// 60 * 60 *1000 一个小时
    //设置秘钥明文
    public static final String JWT_KEY = "sangeng";

    public static String getUUID() {
        String token = UUID.randomUUID().toString().replaceAll("-", "");
        return token;
    }

    /**
     * 生成jtw
     *
     * @param subject token中要存放的数据（json格式）
     * @return
     */
    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成jtw
     *
     * @param subject   token中要存放的数据（json格式）
     * @param ttlMillis token超时时间
     * @return
     */
    public static String createJWT(String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, getUUID());// 设置过期时间
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis,
                                            String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if (ttlMillis == null) {
            ttlMillis = JwtUtil.JWT_TTL;
        }
        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);
        return Jwts.builder()
                .setId(uuid) //唯一的ID
                .setSubject(subject) // 主题 可以是JSON数据
                .setIssuer("sg") // 签发者
                .setIssuedAt(now) // 签发时间
                .signWith(signatureAlgorithm, secretKey) //使用HS256对称加密算法签名, 第二个参数为秘钥
                .setExpiration(expDate);
    }

    /**
     * 创建token
     *
     * @param id
     * @param subject
     * @param ttlMillis
     * @return
     */
    public static String createJWT(String id, String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, id);// 设置过期时间
        return builder.compact();
    }

    public static void main(String[] args) throws Exception {
        String token ="eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjYWM2ZDVhZi1mNjVlLTQ0MDAtYjcxMi0zYWEwOGIyOTIwYjQiLCJzdWIiOiJzZyIsImlzcyI6InNnIiwiaWF0IjoxNjM4MTA2NzEyLCJleHAiOjE2MzgxMTAzMTJ9.JVsSbkP94wuczb4QryQbAke3ysBDIL5ou8fWsbt_ebg ";
        Claims claims = parseJWT(token);
        System.out.println(claims);
    }

    /**
     * 生成加密后的秘钥 secretKey
     *
     * @return
     */
    public static SecretKey generalKey() {
        byte[] encodedKey = Base64.getDecoder().decode(JwtUtil.JWT_KEY);
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length,
                "AES");
        return key;
    }

    /**
     * 解析
     *
     * @param jwt
     * @return
     * @throws Exception
     */
    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwt)
                .getBody();
    }
}
```

```java
@SuppressWarnings(value = {"unchecked", "rawtypes"})
@Component
public class RedisCache {
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key   缓存的键值
     * @param value 缓存的值
     */
    public <T> void setCacheObject(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key      缓存的键值
     * @param value    缓存的值
     * @param timeout  时间
     * @param timeUnit 时间颗粒度
     */
    public <T> void setCacheObject(final String key, final T value, final
    Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @param unit    时间单位
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key 缓存键值
     * @return 缓存键值对应的数据
     */
    public <T> T getCacheObject(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * 删除单个对象
     *
     * @param key
     */
    public boolean deleteObject(final String key) {
        return redisTemplate.delete(key);
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     * @return
     */
    public long deleteObject(final Collection collection) {
        return redisTemplate.delete(collection);
    }

    /**
     * 缓存List数据
     *
     * @param key      缓存的键值
     * @param dataList 待缓存的List数据
     * @return 缓存的对象
     */
    public <T> long setCacheList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    public <T> List<T> getCacheList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 缓存Set
     *
     * @param key     缓存键值
     * @param dataSet 缓存的数据
     * @return 缓存数据的对象
     */
    public <T> BoundSetOperations<String, T> setCacheSet(final String key, final
    Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation =
                redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext()) {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key
     * @return
     */
    public <T> Set<T> getCacheSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 缓存Map
     *
     * @param key
     * @param dataMap
     */
    public <T> void setCacheMap(final String key, final Map<String, T> dataMap) {
        if (dataMap != null) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    /**
     * 获得缓存的Map
     *
     * @param key
     * @return
     */
    public <T> Map<String, T> getCacheMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key   Redis键
     * @param hKey  Hash键
     * @param value 值
     */
    public <T> void setCacheMapValue(final String key, final String hKey, final
    T value) {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public <T> T getCacheMapValue(final String key, final String hKey) {
        HashOperations<String, String, T> opsForHash =
                redisTemplate.opsForHash();
        return opsForHash.get(key, hKey);
    }

    /**
     * 删除Hash中的数据
     *
     * @param key
     * @param hkey
     */
    public void delCacheMapValue(final String key, final String hkey) {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.delete(key, hkey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final
    Collection<Object> hKeys) {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 获得缓存的基本对象列表
     *
     * @param pattern 字符串前缀
     * @return 对象列表
     */
    public Collection<String> keys(final String pattern) {

        return redisTemplate.keys(pattern);
    }
}

```

```java
public class WebUtils {
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param string   待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String
            string) {
        try {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

```java
public class RedisUtils {
    // 启动Redis服务器
    public static void startRedisServer() {
        try {
            Process process = Runtime.getRuntime().exec("C:\\develop1\\Redis-x64-3.2.100\\redis-server.exe C:\\develop1\\Redis-x64-3.2.100\\redis.windows.conf");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // 登录到Redis服务器
    public static void loginRedisCli(String host, int port, String password) {
        try {
            String command = "redis-cli.exe -h " + host + " -p " + port + " -a " + password;
            Process process = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // 启动Redis服务器
        startRedisServer();

        // 登录到Redis服务器
        loginRedisCli("localhost", 6379, "123456");
    }
}
```



5.**实体类**

```java

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author 哈纳桑
 * @since 2024-05-07
 */
@TableName("sys_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户类型：0代表普通用户，1代表管理员
     */
    private String type;

    /**
     * 账号状态（0正常 1停用）
     */
    private String status;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号
     */
    private String phonenumber;

    /**
     * 用户性别（0男，1女，2未知）
     */
    private String sex;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 创建人的用户id
     */
    private Long createBy;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新人
     */
    private Long updateBy;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 删除标志（0代表未删除，1代表已删除）
     */
    private Integer delFlag;


}

```





**项目结构**

<img src="https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510134723878.png" alt="image-20240510134723878" style="zoom:80%;" />



### 4.3实战

#### 1.数据库校验用户

从之前的分析我们可以知道，我们可以自定义一个UserDetailsService,让SpringSecurity使用我们的

UserDetailsService。我们自己的UserDetailsService可以从数据库中查询用户名和密码。

1. **准备工作**

数据库表, 建表语句如下

```sql
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '用户名',
  `nick_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '昵称',
  `password` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '密码',
  `type` char(1) DEFAULT '0' COMMENT '用户类型：0代表普通用户，1代表管理员',
  `status` char(1) DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `phonenumber` varchar(32) DEFAULT NULL COMMENT '手机号',
  `sex` char(1) DEFAULT NULL COMMENT '用户性别（0男，1女，2未知）',
  `avatar` varchar(128) DEFAULT NULL COMMENT '头像',
  `create_by` bigint DEFAULT NULL COMMENT '创建人的用户id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_flag` int DEFAULT '0' COMMENT '删除标志（0代表未删除，1代表已删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14787164048663 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表'
```

2. **引入MybatisPuls和mysql驱动的依赖**(前面已经引入过了)

```xml
        <!-- MyBatis Plus的Spring Boot starter，用于简化MyBatis的使用 -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>3.5.5</version>
        </dependency>
        <!-- MySQL连接器，用于连接和操作MySQL数据库 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.29</version>
        </dependency>
```



3. **配置数据库信息**

```yml
spring:
  application:
    name: SecurityTest
  datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/sg_blog?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
      username: root
      password: qq1664546939
  data:
      redis:
        host: localhost
        port: 6379
        password: 123456
        database: 10
```



4. **定义Mapper接口**(com.sangeng.mapper)

```java
public interface UserMapper extends BaseMapper<User> {}
```



5. **配置Mapper扫描**(com.sangeng)

```java
@SpringBootApplication
@MapperScan("com.example.securitytest.mapper")//扫描mapper
public class SecurityTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityTestApplication.class, args);
    }

}

```



6. **测试MP是否能正常使用**

```java
package com.example.securitytest;

import com.example.securitytest.domain.User;
import com.example.securitytest.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class SecurityTestApplicationTests {

    @Autowired
    UserMapper userMapper;
    @Test
    void contextLoads() {
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }

}
```



#### 2.核心代码

**分析:**

> `SpringSecurity` 默认是在内存中查找对应的用户名密码然后`UserDetailsService`的默认实现类使用封装成`UserDetai`l对象交给`DaoAuthenticationProcider`校验
>
> 但是我们在实际运用场景中是从数据库中查找用户信息	
>
> 所以此时我们需要写一个`UserDetailsService`的实现类用来在数据库中查询用户信息并且封装到`UserDetai`l对象中
>
> 并且需要写一个`UserDetai`的实现类因为用户信息不仅仅只有用户名和密码还有其他信息

##### 1.创建UserDetailsService实现类 

(com.sangeng.service)

```java

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserMapper userMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 根据用户名查询用户信息
        LambdaQueryWrapper wrapper = new LambdaQueryWrapper<User>().eq(User::getUserName, username);
        User user = userMapper.selectOne(wrapper);

        //如果没有该用户就抛出异常
        if (Objects.isNull(user)) {
            throw new RuntimeException("用户名或密码错误");
        }

        //TODO: 查询权限信息封装到LoginUser中


        // 将用户信息封装到UserDetails实现类中
        return new LoginUser(user);
    }
}
```

##### 2.创建UserDetail实现类

(com.sangeng.domain)

```java

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUser implements UserDetails {

    private User user;//封装用户信息

    //获取权限
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    //获取密码
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    //获取用户名
    @Override
    public String getUsername() {
        return user.getUserName();
    }

    //账户是否未过期
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //账户是否未锁定
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //密码是否未过期
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //账户是否可用
    @Override
    public boolean isEnabled() {
        return true;
    }
    
}

```

**注意**：如果要测试，需要往用户表中写入用户数据，并且如果你想让用户的密码是明文存储，需要在密码前加{noop}。例如:

![image-20240510150930053](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510150930053.png)

这样登陆的时候就可以用libai作为用户名，123456作为密码来登陆了。



##### 3.密码加密存储模式更改

>实际项目中我们不会把密码明文存储在数据库中。
>
>默认使用的PasswordEncoder要求数据库中的密码格式为：{id}password 。它会根据id去判断密码的加密方式。
>
>但是我们一般不会采用这种方式。所以就需要替换PasswordEncoder。
>
>我们一般使用SpringSecurity为我们提供的BCryptPasswordEncoder。
>
>我们只需要使用把BCryptPasswordEncoder对象注入Spring容器中，SpringSecurity就会使用该PasswordEncoder来进行密码验。
>
>我们可以定义一个SpringSecurity的配置类，SpringSecurity要求这个配置类要继承
>
>WebSecurityConfigurerAdapter。

**创建SpringSecurity配置类**(com.sangeng.config)

```JAVA
@Configuration //配置类
@EnableWebSecurity // 开启Spring Security的功能 代替了 implements WebSecurityConfigurerAdapter
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```



##### 4.登陆接口

> 接下我们需要自定义登陆接口，然后让SpringSecurity对这个接口放行,让用户访问这个接口的时候不用登录也能访问。
>
>在接口中我们通过AuthenticationManager的authenticate方法来进行用户认证,所以需要在SecurityConfig中配置把AuthenticationManager注入容器。
>
>认证成功的话要生成一个jwt，放入响应中返回。并且为了让用户下回请求时能通过jwt识别出具体的是
>
>哪个用户，我们需要把用户信息存入redis，可以把用户id作为key	

(com.sangeng.controller)

```java
@RestController
public class LoginController {
    @Autowired
    private LoginServcie loginServcie;
    @PostMapping("/user/login")
    public ResponseResult login(@RequestBody User user){
        return loginServcie.login(user);
    }
}
```

(com.sangeng.service)

```java
public interface LoginServcie {
    ResponseResult login(User user);
}
```

(com.sangeng.service.impl)

```java
@Service
public class LoginServiceImpl implements LoginServcie {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    RedisCache redisCache;

    @Override
    public ResponseResult login(User user) {

        //1.封装Authentication对象
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());

        //2.通过AuthenticationManager的authenticate方法来进行用户认证
        Authentication authenticated = authenticationManager.authenticate(authenticationToken);

        //3.在Authentication中获取用户信息
        LoginUser loginUser = (LoginUser) authenticated.getPrincipal();
        String userId = loginUser.getUser().getId().toString();
        //4.认证通过生成token
        String jwt = JwtUtil.createJWT(userId);
        //5.用户信息存入redis
        redisCache.setCacheObject("login:" + userId, loginUser);
        //6.把token返回给前端
        HashMap<Object, Object> hashMap = new HashMap<>();
        hashMap.put("token", jwt);
        return new ResponseResult(200, "登录成功", hashMap);
    }
}
```

(com.sangeng.config)

```java
@Configuration //配置类
@EnableWebSecurity // 开启Spring Security的功能 代替了 implements WebSecurityConfigurerAdapter
public class SecurityConfig {
    @Autowired
    AuthenticationConfiguration authenticationConfiguration;//获取AuthenticationManager

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 配置Spring Security的过滤链。
     *
     * @param http 用于构建安全配置的HttpSecurity对象。
     * @return 返回配置好的SecurityFilterChain对象。
     * @throws Exception 如果配置过程中发生错误，则抛出异常。
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF保护
                .csrf(csrf -> csrf.disable())
                // 设置会话创建策略为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置授权规则   指定user/login路径.允许匿名访问(未登录可访问已登陆不能访问). 其他路径需要身份认证
                .authorizeHttpRequests(auth -> auth.requestMatchers("/user/login").anonymous().anyRequest().authenticated())
                //开启跨域访问
                .cors(AbstractHttpConfigurer::disable);

        // 构建并返回安全过滤链
        return http.build();
    }
}
```

**测试**

![image-20240510160632441](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510160632441.png)



##### 5.认证过滤器

> 我们需要自定义一个过滤器，这个过滤器会去获取请求头中的token，对token进行解析取出其中的userid。(主要作用于除登录外的请求)
>
> 使用userid去redis中获取对应的LoginUser对象。
>
> 然后封装Authentication对象存入SecurityContextHolder

(com.sangeng.filter)

```java
@Component
//OncePerRequestFilter特点是在处理单个HTTP请求时确保过滤器的 doFilterInternal 方法只被调用一次
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Autowired
    RedisCache redisCache;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //1.在请求头中获取token
        String token = request.getHeader("token");

        //此处需要判断token是否为空
        if (!StringUtils.hasText(token)){
            //没有token放行 此时的SecurityContextHolder没有用户信息 会被后面的过滤器拦截
            filterChain.doFilter(request,response);
            return;
        }

        //2.解析token获取用户id
        String subject;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            subject = claims.getSubject();
        } catch (Exception e) {
            //解析失败
            throw new RuntimeException("token非法");
        }
        //3.在redis中获取用户信息 注意：redis中的key是login：+userId
        String redisKey = "login:" + subject;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);

        //此处需要判断loginUser是否为空
        if (Objects.isNull(loginUser)){
            throw new RuntimeException("用户未登录");
        }
        //4.将获取到的用户信息存入SecurityContextHolder 参数（用户信息，，权限信息）
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser, null, null);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        //5.放行
        filterChain.doFilter(request,response);
    }
}
```

**把token校验过滤器添加到过滤器链中**

(com.sangeng.config)

```java
@Configuration //配置类
@EnableWebSecurity // 开启Spring Security的功能 代替了 implements WebSecurityConfigurerAdapter
public class SecurityConfig {
    @Autowired
    AuthenticationConfiguration authenticationConfiguration;//获取AuthenticationManager
    @Autowired
    JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 配置Spring Security的过滤链。
     *
     * @param http 用于构建安全配置的HttpSecurity对象。
     * @return 返回配置好的SecurityFilterChain对象。
     * @throws Exception 如果配置过程中发生错误，则抛出异常。
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF保护
                .csrf(csrf -> csrf.disable())
                // 设置会话创建策略为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置授权规则                 指定user/login路径.允许匿名访问(未登录可访问已登陆不能访问). 其他路径需要身份认证
                .authorizeHttpRequests(auth -> auth.requestMatchers("/user/login").anonymous().anyRequest().authenticated())
                //开启跨域访问
                .cors(AbstractHttpConfigurer::disable)
                // 添加JWT认证过滤器
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        // 构建并返回安全过滤链
        return http.build();
    }


}

```



##### 6.退出登录

我们只需要定义一个登陆接口，然后获取SecurityContextHolder中的认证信息，删除redis中对应的数据即可。

(com.sangeng.service.impl.LoginServiceImpl)

```java
  @Override
    public ResponseResult logout() {
        //获取SecurityContextHolder中的用户id
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        Long userId = loginUser.getUser().getId();
        //删除redis中的用户信息
        redisCache.deleteObject("login:" + userId);
        return new ResponseResult(200, "退出成功");
    }
```

(com.sangeng.controller.LoginController)

```java
    @PostMapping("/user/logout")
    public ResponseResult logout(){
        System.out.println("开始登出");
        return loginServcie.logout();
    }
```



##### 7.自定义失败处理器

> 我们还希望在认证失败或者是授权失败的情况下也能和我们的接口一样返回相同结构的json，这样可以让前端能对响应进行统一的处理。要实现这个功能我们需要知道SpringSecurity的异常处理机制。
>
> 在SpringSecurity中，如果我们在认证或者授权的过程中出现了异常会被ExceptionTranslationFilter捕获到。在ExceptionTranslationFilter中会去判断是认证失败还是授权失败出现的异常。
>
> 如果是认证过程中出现的异常会被封装成AuthenticationException然后调用**AuthenticationEntryPoint**对象的方法去进行异常处理。
>
> 如果是授权过程中出现的异常会被封装成AccessDeniedException然后调用**AccessDeniedHandler**对象的方法去进行异常处理。
>
> 所以如果我们需要自定义异常处理，我们只需要自定义AuthenticationEntryPoint和AccessDeniedHandler然后配置SpringSecurity即可。

(com.sangeng.handler)

```java
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException,
            ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.FORBIDDEN.value(),
                "权限不足");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(response, json);
    }
}
```

```java
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse
            response, AuthenticationException authException) throws IOException,
            ServletException {
        ResponseResult result = new
                ResponseResult(HttpStatus.UNAUTHORIZED.value(), "认证失败请重新登录");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(response, json);
    }
}
```

**修改配置类**

```java
@Configuration //配置类
@EnableWebSecurity // 开启Spring Security的功能 代替了 implements WebSecurityConfigurerAdapter
public class SecurityConfig {
    @Autowired
    AuthenticationConfiguration authenticationConfiguration;//获取AuthenticationManager
    @Autowired
    JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;
    @Autowired
    AccessDeniedHandlerImpl accessDeniedHandler;
    @Autowired
    AuthenticationEntryPointImpl authenticationEntryPoint;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 配置Spring Security的过滤链。
     *
     * @param http 用于构建安全配置的HttpSecurity对象。
     * @return 返回配置好的SecurityFilterChain对象。
     * @throws Exception 如果配置过程中发生错误，则抛出异常。
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF保护
                .csrf(csrf -> csrf.disable())
                // 设置会话创建策略为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置授权规则                 指定user/login路径.允许匿名访问(未登录可访问已登陆不能访问). 其他路径需要身份认证
                .authorizeHttpRequests(auth -> auth.requestMatchers("/user/login").anonymous().anyRequest().authenticated())
                //开启跨域访问
                .cors(AbstractHttpConfigurer::disable)
                // 添加JWT认证过滤器
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // 配置异常处理
                .exceptionHandling(exception -> exception.accessDeniedHandler(accessDeniedHandler).authenticationEntryPoint(authenticationEntryPoint));


        // 构建并返回安全过滤链
        return http.build();
    }
```

**测试**

正常登录

![image-20240510172654681](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510172654681.png)

**访问接口**

![image-20240510172740820](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510172740820.png)

**退出登录**

![image-20240510172818241](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510172818241.png)

**再次访问接口**

![image-20240510172844046](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510172844046.png)



## 5.授权

#### 5.1 权限系统的作用

> 例如一个学校图书馆的管理系统，如果是普通学生登录就能看到借书还书相关的功能，不可能让他看到
>
> 并且去使用添加书籍信息，删除书籍信息等功能。但是如果是一个图书馆管理员的账号登录了，应该就
>
> 能看到并使用添加书籍信息，删除书籍信息等功能。
>
> 总结起来就是**不同的用户可以使用不同的功能**。这就是权限系统要去实现的效果。
>
> 我们不能只依赖前端去判断用户的权限来选择显示哪些菜单哪些按钮。因为如果只是这样，如果有人知
>
> 道了对应功能的接口地址就可以不通过前端，直接去发送请求来实现相关功能操作。
>
> 所以我们还需要在后台进行用户权限的判断，判断当前用户是否有相应的权限，必须具有所需权限才能
>
> 进行相应的操作。



#### 5.2授权基本流程

> 在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在
>
> FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的
>
> 权限信息。当前用户是否拥有访问当前资源所需的权限。
>
> 所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication。
>
> 然后设置我们的资源所需要的权限即可。

#### 5.3 授权基本实现

##### 1.限制访问资源所需权限

> SpringSecurity为我们提供了基于注解的权限控制方案，这也是我们项目中主要采用的方式。我们可以
>
> 使用注解去指定访问对应的资源所需的权限。
>
> 但是要使用它我们需要先开启相关配置。

(com.sangeng.config.SecurityConfig)

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```



> 然后就可以使用对应的注解。@PreAuthorize

(com.sangeng.controller.HelloController)

```java
    @RequestMapping("hello")
    @PreAuthorize("hasAuthority('user')")
    public String hello(){
        return "hello world";
    }
```

##### 2.封装权限信息

我们前面在写UserDetailsServiceImpl的时候说过，在查询出用户后还要获取对应的权限信息，封装到UserDetails中返回。

我们先直接把权限信息写死封装到UserDetails中进行测试。

我们之前定义了UserDetails的实现类LoginUser，想要让其能封装权限信息就要对其进行修改

(com.sangeng.domain.LoginUser)

```java

@Data
@NoArgsConstructor
public class LoginUser implements UserDetails {

    private User user;//封装用户信息

    private List<String> permissions;//存储权限信息

    public LoginUser(User user, List<String> list) {
        this.user = user;
        this.permissions = list;
    }
    //获取权限
    @JSONField(serialize = false) //忽略
    private List<SimpleGrantedAuthority> authorities;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (authorities != null){
            return authorities;
        }
        ////把permissions中字符串类型的权限信息转换成GrantedAuthority对象存入authorities
        authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return authorities;
    }

    //获取密码
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    //获取用户名
    @Override
    public String getUsername() {
        return user.getUserName();
    }

    //账户是否未过期
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //账户是否未锁定
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //密码是否未过期
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //账户是否可用
    @Override
    public boolean isEnabled() {
        return true;
    }

}

```

LoginUser修改完后我们就可以在UserDetailsServiceImpl中去把权限信息封装到LoginUser中了。我们写死权限进行测试，后面我们再从数据库中查询权限信息。

![image-20240510201045102](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510201045102.png)

```java

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserMapper userMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 根据用户名查询用户信息
        LambdaQueryWrapper wrapper = new LambdaQueryWrapper<User>().eq(User::getUserName, username);
        User user = userMapper.selectOne(wrapper);

        //如果没有该用户就抛出异常
        if (Objects.isNull(user)) {
            throw new RuntimeException("用户名或密码错误");
        }

        //TODO: 查询权限信息封装到LoginUser中
        ArrayList<String> list = new ArrayList<>();
        list.add("user");


        // 将用户信息封装到UserDetails实现类中
        return new LoginUser(user,list);
    }
}

```



在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在

FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的

权限信息。当前用户是否拥有访问当前资源所需的权限。

所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication。

![image-20240510201346568](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510201346568.png)

```java
@Component
//OncePerRequestFilter特点是在处理单个HTTP请求时确保过滤器的 doFilterInternal 方法只被调用一次
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Autowired
    RedisCache redisCache;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //1.在请求头中获取token
        String token = request.getHeader("token");

        //此处需要判断token是否为空
        if (!StringUtils.hasText(token)){
            //没有token放行 此时的SecurityContextHolder没有用户信息 会被后面的过滤器拦截
            filterChain.doFilter(request,response);
            return;
        }

        //2.解析token获取用户id
        String subject;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            subject = claims.getSubject();
        } catch (Exception e) {
            //解析失败
            throw new RuntimeException("token非法");
        }
        //3.在redis中获取用户信息 注意：redis中的key是login：+userId
        String redisKey = "login:" + subject;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);

        //此处需要判断loginUser是否为空
        if (Objects.isNull(loginUser)){
            throw new RuntimeException("用户未登录");
        }
        //4.将获取到的用户信息存入SecurityContextHolder 参数（用户信息，，权限信息）
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        //5.放行
        filterChain.doFilter(request,response);
    }
}
```

**测试**

![image-20240510201910744](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510201910744.png)

#### 5.4从数据库查询权限信息

##### 1.RBAC权限模型

RBAC权限模型（Role-Based Access Control）即：基于角色的权限控制。这是目前最常被开发者使用也是相对易用、通用权限模型。

![image-20240510202313997](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510202313997.png)



#####  2.准备工作

```sql
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint DEFAULT '0' COMMENT '父菜单ID',
  `order_num` int DEFAULT '0' COMMENT '显示顺序',
  `path` varchar(200) DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `is_frame` int DEFAULT '1' COMMENT '是否为外链（0是 1否）',
  `menu_type` char(1) DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `visible` char(1) DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT '#' COMMENT '菜单图标',
  `create_by` bigint DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  `del_flag` char(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2034 DEFAULT CHARSET=utf8mb3 COMMENT='菜单权限表'

CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) NOT NULL COMMENT '角色权限字符串',
  `role_sort` int NOT NULL COMMENT '显示顺序',
  `status` char(1) NOT NULL COMMENT '角色状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  `create_by` bigint DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint DEFAULT NULL COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COMMENT='角色信息表'

CREATE TABLE `sys_role_menu` (
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='角色和菜单关联表'

CREATE TABLE `sys_user_role` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='用户和角色关联表'


```

(com.sangeng.domain)

```java
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("sys_menu")
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 菜单ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 菜单名称
     */
    private String menuName;

    /**
     * 父菜单ID
     */
    private Long parentId;

    /**
     * 显示顺序
     */
    private Integer orderNum;

    /**
     * 路由地址
     */
    private String path;

    /**
     * 组件路径
     */
    private String component;

    /**
     * 是否为外链（0是 1否）
     */
    private Integer isFrame;

    /**
     * 菜单类型（M目录 C菜单 F按钮）
     */
    private String menuType;

    /**
     * 菜单状态（0显示 1隐藏）
     */
    private String visible;

    /**
     * 菜单状态（0正常 1停用）
     */
    private String status;

    /**
     * 权限标识
     */
    private String perms;

    /**
     * 菜单图标
     */
    private String icon;

    /**
     * 创建者
     */
    private Long createBy;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新者
     */
    private Long updateBy;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 备注
     */
    private String remark;

    private String delFlag;


}
```

##### 3.代码实现

(com.sangeng.mapper)

```java
public interface MenuMapper extends BaseMapper<Menu> {
    List<String> selectPermsByUserId (Long userId);

}
```

(classpath:mapper)

```java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.securitytest.mapper.MenuMapper">

    <select id="selectPermsByUserId" resultType="java.lang.String">
        select
            distinct perms
        from sys_user_role sur
                 left join sys_role sr on sur.role_id = sr.id
                 left join sys_role_menu srm on sur.role_id = srm.role_id
                 left join sys_menu sm on srm.menu_id = sm.id
        where user_id = #{userId} and sr.status = 0 and sm.status = 0
    </select>
</mapper>
```



然后我们可以在UserDetailsServiceImpl中去调用该mapper的方法查询权限信息封装到LoginUser对象中即可

![image-20240510203353522](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510203353522.png)

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserMapper userMapper;
    @Autowired
    MenuMapper menuMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 根据用户名查询用户信息
        LambdaQueryWrapper wrapper = new LambdaQueryWrapper<User>().eq(User::getUserName, username);
        User user = userMapper.selectOne(wrapper);

        //如果没有该用户就抛出异常
        if (Objects.isNull(user)) {
            throw new RuntimeException("用户名或密码错误");
        }

        //TODO: 查询权限信息封装到LoginUser中
//        ArrayList<String> list = new ArrayList<>();
//        list.add("user");
        List<String> list = menuMapper.selectPermsByUserId(user.getId());


        // 将用户信息封装到UserDetails实现类中
        return new LoginUser(user,list);
    }
}
```

**注意**:cookie:此处需要注意修改HelloController中的权限 之前写的是@PreAuthorize("hasAuthority('user')") 要改为数据库中对应有的权限





## 6.跨域

浏览器出于安全的考虑，使用 XMLHttpRequest对象发起 HTTP请求时必须遵守同源策略，否则就是跨域的HTTP请求，

默认情况下是被禁止的。 同源策略要求源相同才能正常进行通信，即协议、域名、端口号都完全一致。

前后端分离项目，前端项目和后端项目一般都不是同源的，所以肯定会存在跨域请求的问题。

所以我们就要处理一下，让前端能进行跨域请求。

1. 先对SpringBoot配置，运行跨域请求

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                // 设置允许跨域请求的域名
                .allowedOriginPatterns("*")
                // 是否允许cookie
                .allowCredentials(true)
                // 设置允许的请求方式
                .allowedMethods("GET", "POST", "DELETE", "PUT")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }
}
```

2. 开启SpringSecurity的跨域访问

   由于我们的资源都会收到SpringSecurity的保护，所以想要跨域访问还要让SpringSecurity运行跨域访问。

```java
 /**
     * 配置Spring Security的过滤链。
     *
     * @param http 用于构建安全配置的HttpSecurity对象。
     * @return 返回配置好的SecurityFilterChain对象。
     * @throws Exception 如果配置过程中发生错误，则抛出异常。
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 添加JWT认证过滤器jwtAuthenticationTokenFilter在UsernamePasswordAuthenticationFilter之前
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // 禁用CSRF保护
                .csrf(csrf -> csrf.disable())
                // 设置会话创建策略为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置授权规则                 指定user/login路径.允许匿名访问(未登录可访问已登陆不能访问). 其他路径需要身份认证
                .authorizeHttpRequests(auth -> auth.requestMatchers("/user/login").anonymous().anyRequest().authenticated())
                // 配置异常处理
                .exceptionHandling(exception -> exception.accessDeniedHandler(accessDeniedHandler).authenticationEntryPoint(authenticationEntryPoint))
                //开启跨域访问
                .cors();

        // 构建并返回安全过滤链
        return http.build();
    }
```



## 7.遗留小问题




![输入图片说明](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/SpringSecurity/image-20240510123227984.png)