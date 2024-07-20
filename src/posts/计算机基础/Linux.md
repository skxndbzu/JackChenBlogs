---
title: Linux
icon: pen-to-square
date: 2023-05-01
category:
  - Linux
tag:
  - 操作系统
---

# Linux基础命令



## Linux的目录结构

![1684111270039](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1684111270039.png)

- `/`，根目录是最顶级的目录了

- Linux只有一个顶级目录：`/`

- 路径描述的层次关系同样适用`/`来表示

- /home/itheima/a.txt，表示根目录下的home文件夹内有itheima文件夹，内有a.txt

- ## 层级目录

  - /
  - 根目录
  - boot
    - 启动目录
    - 存放的是Linux的系统文件
  - dev
    - 外部设置目录
    - 存放的是Linux的外部设置文件
  - etc(==重点==)
    - Linux系统的配置文件目录
    - 存放系统的配置文件
  - usr
    - 相当于windows中的program files目录
    - 存放一些已安装的程序
  - var
    - 存储一些可变的数据
    - 例如：类似于windows中的日志文件
  - lib
    - Linux系统中的库目录
    - 类似于windows中的dll动态链接库
    - 简单说：linux内核文件
  - bin
    - 存放的是Linux提供的可执行的命令文件
  - sbin
    - 与bin类似
    - 只针对于超级管理员
  - home
    - Linux系统中的家目录
    - 当前帐户信息
    - 类似于windows中的用户目录
  - opt
    - 存放第三方程序的目录
    - 例如：各程序的安装包

## **Linux**命令基础格式

无论是什么命令，用于什么用途，在Linux中，命令有其通用的格式：

![1682426804846](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682426804846.png)

•command： 命令本身

•-options：[可选，非必填]命令的一些选项，可以通过选项控制命令的行为细节

•parameter：[可选，非必填]命令的参数，多数用于命令的指向目标等

语法中的[]，表示可选的意思

## ls命令

功能：列出文件夹信息

当不使用选项和参数，直接使用ls命令本体，表示：以平铺形式，列出当前工作目录下的内容

![1682427070329](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682427070329.png)

语法：`ls [-l -h -a] [参数]`

- 参数：被查看的文件夹，不提供参数，表示查看当前工作目录

- -l，以列表形式查看

  ![1682427576061](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682427576061.png)

- -h，配合-l，以更加人性化的方式显示文件大小

- ![1682428134796](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682428134796.png)

- -a，显示隐藏文件

![1682427557676](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682427557676.png)

语法中的选项是可以组合使用的，比如学习的-a和-l可以组合应用。

写法：

•ls -l -a

•ls -la

•ls -al

上述三种写法，都是一样的，表示同时应用-l和-a的功能

![1682427643491](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682427643491.png)

### 隐藏文件、文件夹

在Linux中以`.`开头的，均是隐藏的。

默认不显示出来，需要`-a`选项才可查看到。



## pwd命令

**Print Work Directory**

功能：展示当前工作目录

语法：`pwd`



## cd命令

**Change Directory**

功能：切换工作目录

语法：`cd [目标目录]`

参数：目标目录，要切换去的地方，不提供默认切换到`当前登录用户HOME目录`



## HOME目录

每一个用户在Linux系统中都有自己的专属工作目录，称之为HOME目录。

- 普通用户的HOME目录，默认在：`/home/用户名`

- root用户的HOME目录，在：`/root`



FinalShell登陆终端后，默认的工作目录就是用户的HOME目录



## 相对路径、绝对路径

- 相对路径，非`/`开头的称之为相对路径

  相对路径表示以`当前目录`作为起点，去描述路径，如`test/a.txt`，表示当前工作目录内的test文件夹内的a.txt文件

- 绝对路径，以/`开头的称之为绝对路径

  绝对路径从`根`开始描述路径



## 特殊路径符

- `.`，表示当前，比如./a.txt，表示当前文件夹内的`a.txt`文件
- `..`，表示上级目录，比如`../`表示上级目录，`../../`表示上级的上级目录
- `~`，表示用户的HOME目录，比如`cd ~`，即可切回用户HOME目录，cd ~/Desktop，切换到HOME内的Desktop目录



## mkdir命令

**Make Directory**

功能：创建文件夹

语法：`mkdir [-p] 参数`

- 参数：被创建文件夹的路径
- 选项：-p，可选，表示创建前置路径



## touch命令

功能：创建文件

语法：`touch 参数`

- 参数：被创建的文件路径，相对、绝对、特殊路径符都可以使用
- 支持多个文件同时创建



## cat命令

功能：查看文件内容

语法：`cat 参数`

- 参数：被查看的文件路径，相对、绝对、特殊路径符都可以使用



## more命令

功能：查看文件，可以支持翻页查看

语法：`more 参数`

- 参数：被查看的文件路径
- 在查看过程中：
  - `空格`键翻页
  - `q`退出查看



## cp命令

功能：复制文件、文件夹

语法：`cp [-r] 参数1 参数2`

- 参数1，被复制的
- 参数2，要复制去的地方
- 选项：-r，可选，复制文件夹和文件使用

示例：

- cp a.txt b.txt，复制当前目录下a.txt为b.txt
- cp a.txt test/，复制当前目录a.txt到test文件夹内
- cp -r test test2，复制文件夹test到当前文件夹内为test2存在



## mv命令

**move**

功能：移动文件、文件夹

语法：`mv 参数1 参数2`

- 参数1：被移动的文件或文件夹

- 参数2：要移动去的地方，参数2如果不存在，则会进行改名

  复制文件夹，必须使用-r选项，否则不会生效



## rm命令

**remove**

功能：删除文件、文件夹

语法：`rm [-r -f] 参数...参数`

- 参数：支持多个，每一个表示被删除的，空格进行分隔
- 选项：-r，删除文件夹和文件使用
- 选项：-f，强制删除，不会给出确认提示，一般root用户会用到



> rm命令很危险，一定要注意，特别是切换到root用户的时候。

rm命令支持通配符 *，用来做模糊匹配

•符号* 表示通配符，即匹配任意内容（包含空），示例：

•test*，表示匹配任何以test开头的内容

•*test，表示匹配任何以test结尾的内容

•*test *，表示匹配任何包含test的内容

演示：

•删除所有以test开头的文件或文件夹

![1682476577467](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682476577467.png)

## which命令

功能：查看命令的程序本体文件路径

语法：`which 参数`

- 参数：被查看的命令

![1682478335361](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682478335361.png)

## find命令

功能：搜索文件

语法1按文件名搜索：find 路径 -name "参数"

- 路径，搜索的起始路径
- 参数，搜索的关键字，支持通配符 * ， 比如：*test表示搜索任意以test结尾的文件

![1682478512622](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682478512622.png)

语法2：

![1682478556884](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682478556884.png)

•+、- 表示大于和小于

•n表示大小数字

•kMG表示大小单位，k(小写字母)表示kb，M表示MB，G表示GB



示例：

•查找小于10KB的文件： find / -size -10k

•查找大于100MB的文件：find / -size +100M

•查找大于1GB的文件：find / -size +1G

## grep命令

功能：过滤关键字

语法：`grep [-n] 关键字 文件路径`

- 选项-n，可选，表示在结果中显示匹配的行的行号。
- 参数，关键字，必填，表示过滤的关键字，带有空格或其它特殊符号，建议使用””将关键字包围起来
- 参数，文件路径，必填，表示要过滤内容的文件路径，可作为内容输入端口

![1682479357868](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682479357868.png)

> 参数文件路径，可以作为管道符的输入

## wc命令

功能：统计

语法：`wc [-c -m -l -w] 文件路径`

- 选项，-c，统计bytes数量

- 选项，-m，统计字符数量

- 选项，-l，统计行数

- 选项，-w，统计单词数量

- 参数，文件路径，被统计的文件，可作为内容输入端口

  不带选项，统计文件:

![1682479622413](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682479622413.png)

> 参数文件路径，可作为管道符的输入,使用过程中就不用输入文件路径

![1682481415308](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682481415308.png)

## 管道符|

写法：`|`

功能：将符号左边的结果，作为符号右边的输入

示例：

`cat a.txt | grep itheima`，将cat a.txt的结果，作为grep命令的输入，用来过滤`itheima`关键字



可以支持嵌套：

`cat a.txt | grep a.txt | grep a`

![1682481683384](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682481683384.png)

## echo命令

功能：输出内容

语法：`echo 参数`

•无需选项，只有一个参数，表示要输出的内容，复杂内容可以用””包围

演示：

•在终端上显示：Hello Linux

![1682481734188](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682481734188.png)

•带有空格或\等特殊符号，建议使用双引号包围

•因为不包围的话，空格后很容易被识别为参数2，尽管echo不受影响，但是要养成习惯哦

![1682481758987](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682481758987.png)



## `反引号

功能：被两个反引号包围的内容，会作为命令执行

示例：

- echo \`pwd\`，会输出当前工作目录

![1682481827581](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682481827581.png)

## tail命令

功能：查看文件尾部内容

语法：`tail [-f -num] 参数`

- 参数：被查看的文件
- 选项：-f，持续跟踪文件修改
- •选项: -num，表示，查看尾部多少行，不填默认10行



## head命令

功能：查看文件头部内容

语法：`head [-n] 参数`

- 参数：被查看的文件
- 选项：-n，查看的行数



## 重定向符

功能：将符号左边的结果，输出到右边指定的文件中去

- `>`，表示覆盖输出
- `>>`，表示追加输出



## vi编辑器

### 命令模式快捷键

![image-20221027215841573](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027215841.png)

![image-20221027215846581](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027215846.png)

![image-20221027215849668](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027215849.png)

### 底线命令快捷键

![image-20221027215858967](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027215858.png)



## 命令的选项

我们学习的一系列Linux命令，它们所拥有的选项都是非常多的。

比如，简单的ls命令就有：-a -A -b -c -C -d -D -f -F -g -G -h -H -i -I -k -l -L -m -n -N -o -p -q -Q -r-R -s -S -t -T -u -U -v -w -x -X -1等选项，可以发现选项是极其多的。

### 查看命令的帮助

可以通过：`命令 --help`查看命令的帮助手册

![image-20221027220005610](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220005.png)

### 查看命令的详细手册

可以通过：`man 命令`查看某命令的详细手册

![image-20221027220009949](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220010.png)



# Linux用户和权限

### root用户（超级管理员）

无论是Windows、MacOS、Linux均采用多用户的管理模式进行权限管理。

•在Linux系统中，拥有最大权限的账户名为：root（超级管理员）

而在前期，我们一直使用的账户是普通的用户：chenminghe

![1682485795565](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682485795565.png)

root用户拥有最大的系统操作权限，而普通用户在许多地方的权限是受限的。

演示：

•使用普通用户在根目录下创建文件夹

•![1682485813370](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682485813370.png)

•切换到root用户后，继续尝试

•![1682485827521](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682485827521.png)

•普通用户的权限，一般在其HOME目录内是不受限的

•一旦出了HOME目录，大多数地方，普通用户仅有只读和执行权限，无修改权限

#### su和exit命令

在前面，我们接触过su命令切换到root账户。

su命令就是用于账户切换的系统命令，其来源英文单词：Switch User

语法：![1682485877033](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682485877033.png)

•- 符号是可选的，表示是否在切换用户后加载环境变量（后续讲解），建议带上

•参数：用户名，表示要切换的用户，用户名也可以省略，省略表示切换到root

•切换用户后，可以通过exit命令退回上一个用户，也可以使用快捷键：ctrl + d

•使用普通用户，切换到其它用户需要输入密码，如切换到root用户

•使用root用户切换到其它用户，无需密码，可以直接切换

#### **sudo**命令

在我们得知root密码的时候，可以通过su命令切换到root得到最大权限。

但是我们不建议长期使用root用户，避免带来系统损坏。

我们可以使用sudo命令，为普通的命令授权，临时以root身份执行。

语法：![1682485992584](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682485992584.png)

•在其它命令之前，带上sudo，即可为这一条命令临时赋予root授权

•但是并不是所有的用户，都有权利使用sudo，我们需要为普通用户配置sudo认证

**为普通用户配置sudo认证**

•切换到root用户，执行visudo命令，会自动通过vi编辑器打开：/etc/sudoers

•在文件的最后添加：

•![1682486036041](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682486036041.png)

•其中最后的NOPASSWD:ALL 表示使用sudo命令，无需输入密码

•最后通过 wq 保存

•切换回普通用户

•![1682486040372](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682486040372.png)

•执行的命令，均以root运行

## **用户组管理**

以下命令需root用户执行

•创建用户组

groupadd 用户组名



•删除用户组

groupdel 用户组名



为后续演示，我们创建一个testt用户组：groupadd test

## **用户管理**

以下命令需root用户执行

•创建用户

useradd [-g -d] 用户名

•选项：-g指定用户的组，不指定-g，会创建同名组并自动加入，指定-g需要组已经存在，如已存在同名组，必须使用-g

•选项：-d指定用户HOME路径，不指定，HOME目录默认在：/home/用户名

•删除用户

userdel [-r] 用户名

•选项：-r，删除用户的HOME目录，不使用-r，删除用户时，HOME目录保留

•查看用户所属组

id [用户名]

•参数：用户名，被查看的用户，如果不提供则查看自身

•修改用户所属组

usermod -aG 用户组 用户名，将指定用户加入指定用户组

### **getent**

使用getent命令，可以查看当前系统中有哪些用户

语法： getent passwd

![1682558008444](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682558008444.png)

共有7份信息，分别是：

用户名:密码(x):用户ID:组ID:描述信息(无用):HOME目录:执行终端(默认bash)

使用getent命令，同样可以查看当前系统中有哪些用户组

语法：getent group

![1682558059117](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682558059117.png)

包含3份信息，组名称:组认证(显示为x):组ID

## 查看控制权限

通过ls -l 可以以列表形式查看内容，并显示权限细节

![1682558901585](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682558901585.png)

•序号1，表示文件、文件夹的权限控制信息

•序号2，表示文件、文件夹所属用户

•序号3，表示文件、文件夹所属用户组

#### **认知权限信息**

让我们来解析一下序号1，权限细节

权限细节总共分为10个槽位

![1682558937316](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682558937316.png)

![1682558955551](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682558955551.png)

举例：drwxr-xr-x，表示：

•这是一个文件夹，首字母d表示

•所属用户(右上角图序号2)的权限是：有r有w有x，rwx

•所属用户组(右上角图序号3)的权限是：有r无w有x，r-x （-表示无此权限）

•其它用户的权限是：有r无w有x，r-x

rwx到底代表什么呢？

•r表示读权限

•w表示写权限

•x表示执行权限

针对文件、文件夹的不同，rwx的含义有细微差别

•r，针对文件可以查看文件内容

•针对文件夹，可以查看文件夹内容，如ls命令

•w，针对文件表示可以修改此文件

•针对文件夹，可以在文件夹内：创建、删除、改名等操作

•x，针对文件表示可以将文件作为程序执行

针对文件夹，表示可以更改工作目录到此文件夹，即cd进入

## 修改权限信息

## chmod命令

我们可以使用chmod命令，修改文件、文件夹的权限信息。

注意，只有文件、文件夹的所属用户或root用户可以修改。

语法：

•选项：-R，对文件夹内的全部内容应用同样的操作

示例：![1682559869224](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682559869224.png)

•chmod u=rwx,g=rx,o=x hello.txt ，将文件权限修改为：rwxr-x--x

•其中：u表示user所属用户权限，g表示group组权限，o表示other其它用户权限

•**chmod -R u=rwx,g=rx,o=x test**，将文件夹test以及文件夹内全部内容权限设置为：rwxr-x--x

除此之外，还有快捷写法：chmod 751 hello.txt

将hello.txt的权限修改为751

•将hello.txt的权限修改为： r-x--xr-x，数字序号为：

**chmod 515 hello.txt**

•将hello.txt的权限修改为： -wx-w-rw-，数字序号为：

**chmod 326 hello.txt**

•序号123代表的权限是：

--x-w--wx

## 修改权限控制

### chown修改所属用户、用户组

使用chown命令，可以修改文件、文件夹的所属用户和用户组

普通用户无法修改所属为其它用户或组，所以此命令只适用于root用户执行

语法：![1682560849714](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682560849714.png)

•选项，-R，同chmod，对文件夹内全部内容应用相同规则

•选项，用户，修改所属用户

•选项，用户组，修改所属用户组

•:用于分隔用户和用户组

![1682560859950](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682560859950.png)

示例：

•chown root hello.txt，将hello.txt所属用户修改为root

•chown :root hello.txt，将hello.txt所属用户组修改为root

•chown root:itheima hello.txt，将hello.txt所属用户修改为root，用户组修改为itheima

•chown -R root test，将文件夹test的所属用户修改为root并对文件夹内全部内容应用同样规则

# Linux常用操作

## 软件安装

- CentOS系统使用：
  - yum [install remove search] [-y] 软件名称
    - install 安装
    - remove 卸载
    - search 搜索
    - -y，自动确认
- Ubuntu系统使用
  - apt [install remove search] [-y] 软件名称
    - install 安装
    - remove 卸载
    - search 搜索
    - -y，自动确认

> yum 和 apt 均需要root权限



## systemctl

功能：控制系统服务的启动关闭等

语法：`systemctl start | stop | restart | disable | enable | status 服务名`

- start，启动
- stop，停止
- status，查看状态
- disable，关闭开机自启
- enable，开启开机自启
- restart，重启



## 软链接

功能：创建文件、文件夹软链接（快捷方式）

语法：`ln -s 参数1 参数2`

- 参数1：被链接的
- 参数2：要链接去的地方（快捷方式的名称和存放位置）



## 日期

语法：`date [-d] [+格式化字符串]`

- -d 按照给定的字符串显示日期，一般用于日期计算

- 格式化字符串：通过特定的字符串标记，来控制显示的日期格式
  - %Y   年%y   年份后两位数字 (00..99)
  - %m   月份 (01..12)
  - %d   日 (01..31)
  - %H   小时 (00..23)
  - %M   分钟 (00..59)
  - %S   秒 (00..60)
  - %s   自 1970-01-01 00:00:00 UTC 到现在的秒数



示例：

- 按照2022-01-01的格式显示日期

  ![image-20221027220514640](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220514.png)

- 按照2022-01-01 10:00:00的格式显示日期

  ![image-20221027220525625](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220525.png)

- -d选项日期计算

  ![image-20221027220429831](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220429.png)

  - 支持的时间标记为：

    ![image-20221027220449312](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220449.png)





## 时区

修改时区为中国时区

![image-20221027220554654](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027220554.png)



## ntp

功能：同步时间

安装：`yum install -y ntp`

启动管理：`systemctl start | stop | restart | status | disable | enable ntpd`



手动校准时间：`ntpdate -u ntp.aliyun.com`



## ip地址

格式：a.b.c.d

- abcd为0~255的数字



特殊IP：

- 127.0.0.1，表示本机
- 0.0.0.0
  - 可以表示本机
  - 也可以表示任意IP（看使用场景）



查看ip：`ifconfig`



## 主机名

功能：Linux系统的名称

查看：`hostname`

设置：`hostnamectl set-hostname 主机名`



## 配置VMware固定IP

1. 修改VMware网络，参阅PPT，图太多

2. 设置Linux内部固定IP

   修改文件：`/etc/sysconfig/network-scripts/ifcfg-ens33`

   示例文件内容：

   ```shell
   TYPE="Ethernet"
   PROXY_METHOD="none"
   BROWSER_ONLY="no"
   BOOTPROTO="static"			# 改为static，固定IP
   DEFROUTE="yes"
   IPV4_FAILURE_FATAL="no"
   IPV6INIT="yes"
   IPV6_AUTOCONF="yes"
   IPV6_DEFROUTE="yes"
   IPV6_FAILURE_FATAL="no"
   IPV6_ADDR_GEN_MODE="stable-privacy"
   NAME="ens33"
   UUID="1b0011cb-0d2e-4eaa-8a11-af7d50ebc876"
   DEVICE="ens33"
   ONBOOT="yes"
   IPADDR="192.168.88.131"		# IP地址，自己设置，要匹配网络范围
   NETMASK="255.255.255.0"		# 子网掩码，固定写法255.255.255.0
   GATEWAY="192.168.88.2"		# 网关，要和VMware中配置的一致
   DNS1="192.168.88.2"			# DNS1服务器，和网关一致即可
   ```



## ps命令

功能：查看进程信息

语法：`ps -ef`，查看全部进程信息，可以搭配grep做过滤：`ps -ef | grep xxx`



## kill命令

![image-20221027221303037](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221303.png)



## nmap命令

![image-20221027221241123](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221241.png)



## netstat命令

功能：查看端口占用

用法：`netstat -anp | grep xxx`



## ping命令

测试网络是否联通

语法：`ping [-c num] 参数`

![image-20221027221129782](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221129.png)



## wget命令

![image-20221027221148964](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221149.png)

## curl命令

![image-20221027221201079](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221201.png)

![image-20221027221210518](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221210.png)



## top命令

功能：查看主机运行状态

语法：`top`，查看基础信息



可用选项：

![image-20221027221340729](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221340.png)



交互式模式中，可用快捷键：

![image-20221027221354137](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221354.png)



## df命令

查看磁盘占用

![image-20221027221413787](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221413.png)



## iostat命令

查看CPU、磁盘的相关信息

![image-20221027221439990](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221440.png)

![image-20221027221514237](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221514.png)



## sar命令

查看网络统计

![image-20221027221545822](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221545.png)



## 环境变量

- 临时设置：export 变量名=变量值
- 永久设置：
  - 针对用户，设置用户HOME目录内：`.bashrc`文件
  - 针对全局，设置`/etc/profile`



### PATH变量

记录了执行程序的搜索路径

可以将自定义路径加入PATH内，实现自定义命令在任意地方均可执行的效果



## $符号

可以取出指定的环境变量的值

语法：`$变量名`

示例：

`echo $PATH`，输出PATH环境变量的值

`echo ${PATH}ABC`，输出PATH环境变量的值以及ABC

如果变量名和其它内容混淆在一起，可以使用${}





## 压缩解压

### 压缩

`tar -zcvf 压缩包 被压缩1...被压缩2...被压缩N`

- -z表示使用gzip，可以不写



`zip [-r] 参数1 参数2 参数N`

![image-20221027221906247](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221906.png)



### 解压

`tar -zxvf 被解压的文件 -C 要解压去的地方`

- -z表示使用gzip，可以省略
- -C，可以省略，指定要解压去的地方，不写解压到当前目录







`unzip [-d] 参数`

![image-20221027221939899](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027221939.png)





## su命令

切换用户

语法：`su [-] [用户]`

![image-20221027222021619](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222021.png)



## sudo命令

![image-20221027222035337](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222035.png)



比如：

```shell
itheima ALL=(ALL)       NOPASSWD: ALL
```

在visudo内配置如上内容，可以让itheima用户，无需密码直接使用`sudo`



## chmod命令

修改文件、文件夹权限



语法：`chmod [-R] 权限 参数`

- 权限，要设置的权限，比如755，表示：`rwxr-xr-x`

  ![image-20221027222157276](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222157.png)

- 参数，被修改的文件、文件夹

- 选项-R，设置文件夹和其内部全部内容一样生效



## chown命令

修改文件、文件夹所属用户、组

![image-20221027222326192](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222326.png)



## 用户组管理

![image-20221027222354498](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222354.png)



## 用户管理

![image-20221027222407618](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222407.png)



## genenv命令

- `getenv group`，查看系统全部的用户组

  ![image-20221027222446514](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222446.png)

- `getenv passwd`，查看系统全部的用户

  ![image-20221027222512274](https://image-set.oss-cn-zhangjiakou.aliyuncs.com/img-out/2022/10/27/20221027222512.png)



## env命令

查看系统全部的环境变量

语法：`env`



# linux的实用操作

## 各类快捷键

### **ctrl + c** 强制停止

•Linux某些程序的运行，如果想要强制停止它，可以使用快捷键ctrl + c

![1682574579375](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574579375.png)

•命令输入错误，也可以通过快捷键ctrl + c，退出当前输入，重新输入

![1682574589900](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574589900.png)



### **ctrl + d** 退出或登出

•可以通过快捷键：ctrl + d，退出账户的登录

![1682574645248](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574645248.png)

•或者退出某些特定程序的专属页面

![1682574650155](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574650155.png)

ps：不能用于退出vi/vim



### 历史搜索命令history

•可以通过history命令，查看历史输入过的命令

![1682574688942](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574688942.png)

### **历史命令搜索**

•可以通过快捷键：ctrl + r，输入内容去匹配历史命令

![1682574737127](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682574737127.png)

如果搜索到的内容是你需要的，那么：

•回车键可以直接执行

•键盘左右键，可以得到此命令（不执行）

### **光标移动快捷键**

•ctrl + a，跳到命令开头

•ctrl + e，跳到命令结尾

•ctrl + 键盘左键，向左跳一个单词

•ctrl + 键盘右键，向右跳一个单词

### **清屏**

•通过快捷键ctrl + l，可以清空终端内容

•或通过命令clear得到同样效果

# 软件安装

## yum为CentOS系统安装软件

### **Linux**系统的应用商店

操作系统安装软件有许多种方式，一般分为：

•下载安装包自行安装

•如win系统使用exe文件、msi文件等

•如mac系统使用dmg文件、pkg文件等 

•系统的应用商店内安装

•如win系统有Microsoft Store商店

•如mac系统有AppStore商店



Linux系统同样支持这两种方式，我们首先，先来学习使用：Linux命令行内的”应用商店”，yum命令安装软件

### **yum**命令

yum：RPM包软件管理器，用于自动化安装配置Linux软件，并可以自动解决依赖问题。

语法：![1682576167826](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682576167826.png)

•选项：-y，自动确认，无需手动确认安装或卸载过程

•install：安装

•remove：卸载

•search：搜索

yum命令需要root权限哦，可以su切换到root，或使用sudo提权。

yum命令需要联网

•yum [-y] install wget， 通过yum命令安装wget程序

![1682576855110](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682576855110.png)

•yum [-y] remove wget，通过yum命令卸载wget命令

![1682576827546](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682576827546.png)

•yum search wget，通过yum命令，搜索是否有wget安装包

![1682576878382](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682576878382.png)

### apt命令- 扩展

前面学习的各类Linux命令，都是通用的。 但是软件安装，CentOS系统和Ubuntu是使用不同的包管理器。

CentOS使用yum管理器，Ubuntu使用apt管理器

通过前面学习的WSL环境，我们可以得到Ubuntu运行环境。

语法：![1682576982231](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682576982231.png)

用法和yum一致，同样需要root权限

•apt install wget，安装wget

•apt remove wget，移除wget

•apt search wget，搜索wget

## systemctl命令控制软件的启动和关闭

Linux系统很多软件（内置或第三方）均支持使用systemctl命令控制：启动、停止、开机自启

能够被systemctl管理的软件，一般也称之为：服务

语法：![1682577153790](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682577153790.png)

•start 启动

•stop 关闭

•status 查看状态

•enable 开启开机自启

•disable 关闭开机自启

系统内置的服务比较多，比如：

•NetworkManager，主网络服务

•network，副网络服务

•firewalld，防火墙服务

•sshd，ssh服务（FinalShell远程登录Linux使用的就是这个服务）

现在可以使用systemctl去尝试一下，控制这些服务的启动、关闭、自启动啦

除了内置的服务以外，部分第三方软件安装后也可以以systemctl进行控制。



•yum install -y ntp，安装ntp软件

可以通过ntpd服务名，配合systemctl进行控制



•yum install -y httpd，安装apache服务器软件

可以通过httpd服务名，配合systemctl进行控制

部分软件安装后没有自动集成到systemctl中，我们可以手动添加。

# 软连接

## ln命令创建软连接

在系统中创建软链接，可以将文件、文件夹链接到其它位置。

类似Windows系统中的《快捷方式》

语法：![1682581694575](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682581694575.png)

•-s选项，创建软连接

•参数1：被链接的文件或文件夹

•参数2：要链接去的目的地

实例：

•ln -s /etc/yum.conf ~/yum.conf

•ln -s /etc/yum ~/yum

 ![1682582215585](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682582215585.png)

## 日期和时区

### date命令查看日期时间

#### date命令

通过date命令可以在命令行中查看系统的时间

语法：![1682582540124](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682582540124.png)

• -d 按照给定的字符串显示日期，一般用于日期计算

• 格式化字符串：通过特定的字符串标记，来控制显示的日期格式

• **%Y   年**

• **%y   年份后两位数字 (00..99)**

• **%m   月份 (01..12)**

• **%d   日 (01..31)**

• **%H**   **小时** **(00..23)**

• **%M**   **分钟** **(00..59)**

• **%S   秒 (00..60)**

• **%s   自 1970-01-01 00:00:00 UTC** **到现在的秒数**

•使用date命令本体，无选项，直接查看时间

![1682582625927](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682582625927.png)

可以看到这个格式非常的不习惯。我们可以通过格式化字符串自定义显示格式

•按照2022-01-01的格式显示日期

![1682582629025](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682582629025.png)

•按照2022-01-01 10:00:00的格式显示日期

![1682582634400](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682582634400.png)

如上，由于中间带有空格，所以使用双引号包围格式化字符串，作为整体。

#### **date**命令进行日期加减

•-d选项，可以按照给定的字符串显示日期，一般用于日期计算

![1682583168314](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682583168314.png)

•其中支持的时间标记为：

**•year**年

**•month**月

**•day**天

**•hour**小时

**•minute**分钟

**•second**秒

•-d选项可以和 格式化字符串配合一起使用哦

![1682583255021](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682583255021.png)

### 修改Linux系统的时区

细心的同学可能会发现，通过date查看的日期时间是不准确的，这是因为：系统默认时区非中国的东八区。

使用root权限，执行如下命令，修改时区为东八区时区

![1682583324186](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682583324186.png)

将系统自带的localtime文件删除，并将/usr/share/zoneinfo/Asia/Shanghai文件链接为localtime文件即可

![1682583520760](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682583520760.png)

### 使用ntp进行时间同步和校准

安装ntp：yum -y install ntp

启动并设置开机自启：

•systemctl start ntpd

•systemctl enable ntpd

当ntpd启动后会定期的帮助我们联网校准系统的时间



•也可以手动校准（需root权限）：ntpdate -u ntp.aliyun.com

通过阿里云提供的服务网址配合ntpdate（安装ntp后会附带这个命令）命令自动校准

![1682585015570](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682585015570.png)

# IP地址和主机名

## IP地址

每一台联网的电脑都会有一个地址，用于和其它计算机进行通讯

IP地址主要有2个版本，V4版本和V6版本（V6很少用，课程暂不涉及）

IPv4版本的地址格式是：a.b.c.d，其中abcd表示0~255的数字，如192.168.88.101就是一个标准的IP地址

可以通过命令：ifconfig，查看本机的ip地址，如无法使用ifconfig命令，可以安装：yum -y install net-tools

![1682585265106](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682585265106.png)

### **特殊**IP地址

除了标准的IP地址以外，还有几个特殊的IP地址需要我们了解：

•127.0.0.1，这个IP地址用于指代本机



•0.0.0.0，特殊IP地址

•可以用于指代本机

•可以在端口绑定中用来确定绑定关系（后续讲解）

•在一些IP地址限制中，表示所有IP的意思，如放行规则设置为0.0.0.0，表示允许任意IP访问

## **主机名**

每一台电脑除了对外联络地址（IP地址）以外，也可以有一个名字，称之为主机名

无论是Windows或Linux系统，都可以给系统设置主机名

•Windows系统主机名

![1682585576429](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682585576429.png)

•Linux系统主机名

![1682585583254](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682585583254.png)

### **在**Linux中修改主机名

•可以使用命令：hostname查看主机名

![1682587145834](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587145834.png)

•可以使用命令：hostnamectl set-hostname 主机名，修改主机名（需root）

![1682587149181](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587149181.png)

•重新登录FinalShell即可看到主机名已经正确显示

![1682587152313](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587152313.png)

#### **域名解析**

IP地址实在是难以记忆，有没有什么办法可以通过主机名或替代的字符地址去代替数字化的IP地址呢？

实际上，我们一直都是通过字符化的地址去访问服务器，很少指定IP地址

比如，我们在浏览器内打开：www.baidu.com，会打开百度的网址

其中，www.baidu.com，是百度的网址，我们称之为：域名

访问www.baidu.com的流程如下：

![1682587315174](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587315174.png)

即：

•先查看本机的记录（私人地址本）

•Windows看：C:\Windows\System32\drivers\etc\hosts

•Linux看：/etc/hosts

•再联网去DNS服务器（如114.114.114.114，8.8.8.8等）询问

比如，我们FinalShell是通过IP地址连接到的Linux服务器，那有没有可能通过域名（主机名）连接呢？



可以，我们只需要在Windows系统的：C:\Windows\System32\drivers\etc\hosts文件中配置记录即可

![1682587355781](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587355781.png)

![1682587333475](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587333475.png)

## 虚拟机配置固定IP

### VMware Workstation中配置Linux系统的固定IP地址（用于Windows系统）

当前我们虚拟机的Linux操作系统，其IP地址是通过DHCP服务获取的。

DHCP：动态获取IP地址，即每次重启设备后都会获取一次，可能导致IP地址频繁变更

原因1：办公电脑IP地址变化无所谓，但是我们要远程连接到Linux系统，如果IP地址经常变化我们就要频繁修改适配很麻烦

原因2：在刚刚我们配置了虚拟机IP地址和主机名的映射，如果IP频繁更改，我们也需要频繁更新映射关系

综上所述，我们需要IP地址固定下来，不要变化了。

配置固定IP需要2个大步骤：

1.在VMware Workstation（或Fusion）中配置IP地址网关和网段（IP地址的范围）

2.在Linux系统中手动修改配置文件，固定IP

![1682587586601](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682587586601.png)

现在进行第二步，在Linux系统中修改固定IP

•使用vim编辑/etc/sysconfig/network-scripts/ifcfg-ens33文件，填入如下内容

![1682589248764](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589248764.png)

•执行：systemctl restart network 重启网卡，执行ifconfig即可看到ip地址固定为192.168.88.130了

### 在VMware Fusion中配置Linux系统的固定IP地址（用于MacOS系统）

步骤一：先修改VMware Fusion的网络设置

1. 打开Mac系统的终端程序，并执行如下命令：

2. 在终端内执行：sudo su - 并输入个人系统密码切换到root用户

![1682589311474](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589311474.png)

3. 先备份一下文件：cp /Library/Preferences/VMware\ Fusion/networking /Library/Preferences/VMware\ Fusion/networking.bakcup

通过vim编辑器修改文件：vim /Library/Preferences/VMware\ Fusion/networking

![1682589316568](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589316568.png)

修改第11行为如图内容：192.168.88.0，并保存退出

4. 备份文件：cp /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf.backup

修改文件：vim /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf

![1682589335841](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589335841.png)

如图所示在 NAT gateway address下修改：ip为：192.168.88.2（这是网关的IP），并保存退出

5. 启动VMware Fusion，进入Linux虚拟机

步骤2：在Linux中修改固定IP

•在虚拟机的图形化页面中，打开终端，使用su - 切换到root用户

![1682589394762](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589394762.png)

•使用vim编辑/etc/sysconfig/network-scripts/ifcfg-ens33文件，填入如下内容

![1682589400413](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589400413.png)

•执行：systemctl restart network 重启网卡，执行ifconfig即可看到ip地址固定为192.168.88.130了

# 网络传输

## 使用ping命令检查服务器是否可联通

可以通过ping命令，检查指定的网络服务器是否是可联通状态

语法：![1682589713751](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589713751.png)

•选项：-c，检查的次数，不使用-c选项，将无限次数持续检查

•参数：ip或主机名，被检查的服务器的ip地址或主机名地址

示例：

•检查到baidu.com是否联通

![1682589719004](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589719004.png)

结果表示联通，延迟8ms左右

•检查到39.156.66.10是否联通，并检查3次

![1682589724879](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682589724879.png)

## 使用wget命令下载文件

wget是非交互式的文件下载器，可以在命令行内下载网络文件

语法：![1682597664397](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597664397.png)

•选项：-b，可选，后台下载，会将日志写入到当前工作目录的wget-log文件

•参数：url，下载链接

示例：

•下载apache-hadoop 3.3.0版本：wget http://archive.apache.org/dist/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz

![1682597723806](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597723806.png)

•在后台下载：wget -b http://archive.apache.org/dist/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz

•通过tail命令可以监控后台下载进度：tail -f wget-log



注意：无论下载是否完成，都会生成要下载的文件，如果下载未完成，请及时清理未完成的不可用文件。

## 使用curl命令发起网络请求

curl可以发送http网络请求，可用于：下载文件、获取信息等

语法：![1682597742917](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597742917.png)

•选项：-O，用于下载文件，当url是下载链接时，可以使用此选项保存文件

•参数：url，要发起请求的网络地址

示例：

•向cip.cc发起网络请求：curl cip.cc

![1682597752759](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597752759.png)

•向python.itheima.com发起网络请求：curl python.itheima.com

•通过curl下载hadoop-3.3.0安装包：curl -O http://archive.apache.org/dist/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz 

## 端口的概念

端口，是设备与外界通讯交流的出入口。端口可以分为：物理端口和虚拟端口两类

•物理端口：又可称之为接口，是可见的端口，如USB接口，RJ45网口，HDMI端口等

![1682597840056](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597840056.png)

•虚拟端口：是指计算机内部的端口，是不可见的，是用来操作系统和外部进行交互使用的

![1682597848795](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682597848795.png)

物理端口我们日常生活中经常见到，也能知晓它的作用。

但是虚拟端口，有什么用？为什么需要它呢？

![1682598043680](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598043680.png)

![1682598048984](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598048984.png)

计算机程序之间的通讯，通过IP只能锁定计算机，但是无法锁定具体的程序。

通过端口可以锁定计算机上具体的程序，确保程序之间进行沟通

IP地址相当于小区地址，在小区内可以有许多住户（程序），而门牌号（端口）就是各个住户（程序）的联系地址

Linux系统是一个超大号小区，可以支持65535个端口，这6万多个端口分为3类进行使用：

•公认端口：1~1023，通常用于一些系统内置或知名程序的预留使用，如SSH服务的22端口，HTTPS服务的443端口

非特殊需要，不要占用这个范围的端口

•注册端口：1024~49151，通常可以随意使用，用于松散的绑定一些程序\服务

•动态端口：49152~65535，通常不会固定绑定程序，而是当程序对外进行网络链接时，用于临时使用。

![1682598089152](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598089152.png)

如图中，计算机A的微信连接计算机B的微信，A使用的50001即动态端口，临时找一个端口作为出口

计算机B的微信使用端口5678，即注册端口，长期绑定此端口等待别人连接

**PS**：上述微信的端口仅为演示，具体微信的端口使用非图中示意

## 查看端口占用

可以通过Linux命令去查看端口的占用情况

•使用nmap命令，安装nmap：yum -y install nmap

语法：nmap 被查看的IP地址

![1682598134110](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598134110.png)

可以看到，本机（127.0.0.1）上有5个端口现在被程序占用了。

其中：

•22端口，一般是SSH服务使用，即FinalShell远程连接Linux所使用的端口

•可以通过netstat命令，查看指定端口的占用情况

语法：netstat -anp | grep 端口号，安装netstat：yum -y install net-tools

![1682598470731](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598470731.png)

如图，可以看到当前系统6000端口被程序（进程号7174）占用了

其中，0.0.0.0:6000，表示端口绑定在0.0.0.0这个IP地址上，表示允许外部访问

![1682598476566](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598476566.png)

可以看到，当前系统12345端口，无人使用哦。

# 进程管理

## 进程的概念

程序运行在操作系统中，是被操作系统所管理的。

为管理运行的程序，每一个程序在运行的时候，便被操作系统注册为系统中的一个：进程

并会为每一个进程都分配一个独有的：进程ID（进程号）

![1682598641130](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598641130.png)

![1682598652076](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598652076.png)

## 查看进程、关闭进程

可以通过ps命令查看Linux系统中的进程信息

语法：![1682598673559](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598673559.png)

选项：-e，显示出全部的进程

选项：-f，以完全格式化的形式展示信息（展示全部信息）

一般来说，固定用法就是： ps -ef 列出全部进程的全部信息

![1682598685242](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682598685242.png)

**从左到右分别是：**

**•UID**：进程所属的用户ID

**•PID**：进程的进程号ID

**•PPID**：进程的父ID（启动此进程的其它进程）

**•C**：此进程的CPU占用率（百分比）

**•STIME**：进程的启动时间

**•TTY**：启动此进程的终端序号，如显示?，表示非终端启动

**•TIME**：进程占用CPU的时间

**•CMD**：进程对应的名称或启动路径或启动命令

•在FinalShell中，执行命令：tail，可以看到，此命令一直阻塞在那里

•在FinalShell中，复制一个标签页，执行：ps -ef 找出tail这个程序的进程信息

•问题：是否会发现，列出的信息太多，无法准确的找到或很麻烦怎么办？



我们可以使用管道符配合grep来进行过滤，如：

ps -ef | grep tail，即可准确的找到tail命令的信息

![1682599310826](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599310826.png)

•过滤不仅仅过滤名称，进程号，用户ID等等，都可以被grep过滤哦

•如：ps -ef | grep 30001，过滤带有30001关键字的进程信息（一般指代过滤30001进程号）

在Windows系统中，可以通过任务管理器选择进程后，点击结束进程从而关闭它。

同样，在Linux中，可以通过kill命令关闭进程。

语法：![1682599324662](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599324662.png)

选项：-9，表示强制关闭进程。不使用此选项会向进程发送信号要求其关闭，但是否关闭看进程自身的处理机制。

![1682599341744](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599341744.png)

# 主机状态

## 查看主机运行状态的监控命令

### **查看**系统资源占用

•可以通过top命令查看CPU、内存使用情况，类似Windows的任务管理器

​     默认每5秒刷新一次，语法：直接输入top即可，按q或ctrl + c退出

![1682599435049](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599435049.png)

### **top**命令内容详解

•第一行：![1682599619904](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599619904.png)

top：命令名称，14:39:58：当前系统时间，up 6 min：启动了6分钟，2 users：2个用户登录，load：1、5、15分钟负载

•第二行：![1682599624331](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599624331.png)

Tasks：175个进程，1 running：1个进程子在运行，174 sleeping：174个进程睡眠，0个停止进程，0个僵尸进程

•第三行：![1682599627908](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599627908.png)

%Cpu(s)：CPU使用率，us：用户CPU使用率，sy：系统CPU使用率，ni：高优先级进程占用CPU时间百分比，id：空闲CPU率，wa：IO等待CPU占用率，hi：CPU硬件中断率，si：CPU软件中断率，st：强制等待占用CPU率

•第四、五行：![1682599630748](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599630748.png)

Kib Mem：物理内存，total：总量，free：空闲，used：使用，buff/cache：buff和cache占用

KibSwap：虚拟内存（交换空间），total：总量，free：空闲，used：使用，buff/cache：buff和cache占用

![1682599642141](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599642141.png)

•PID：进程id

•USER：进程所属用户

•PR：进程优先级，越小越高

•NI：负值表示高优先级，正表示低优先级

•VIRT：进程使用虚拟内存，单位KB

•RES：进程使用物理内存，单位KB

•SHR：进程使用共享内存，单位KB

•S：进程状态（S休眠，R运行，Z僵死状态，N负数优先级，I空闲状态）

•%CPU：进程占用CPU率

•%MEM：进程占用内存率

•TIME+：进程使用CPU时间总计，单位10毫秒

•COMMAND：进程的命令或名称或程序文件路径

top命令也支持选项：

![1682599733033](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682599733033.png)

### **top**交互式选项

当top以交互式运行（非-b选项启动），可以用以下交互式命令进行控制

![1682600271060](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682600271060.png)

### **磁盘信息监控**

•使用df命令，可以查看硬盘的使用情况

语法：df [-h]

选项：-h，以更加人性化的单位显示

![1682600579156](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682600579156.png)

•可以使用iostat查看CPU、磁盘的相关信息

语法：iostat [-x] [num1] [num2]

•选项：-x，显示更多信息

•num1：数字，刷新间隔，num2：数字，刷新几次,如果没有，就代表一直刷新

![1682600828780](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682600828780.png)

tps：该设备每秒的传输次数（Indicate the number of transfers per second that were issued to the device.）。"一次传输"意思是"一次I/O请求"。多个逻辑请求可能会被合并为"一次I/O请求"。"一次传输"请求的大小是未知的。

•使用iostat的-x选项，可以显示更多信息

![1682600900370](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682600900370.png)

rrqm/s：  每秒这个设备相关的读取请求有多少被Merge了（当系统调用需要读取数据的时候，VFS将请求发到各个FS，如果FS发现不同的读取请求读取的是相同Block的数据，FS会将这个请求合并Merge, 提高IO利用率, 避免重复调用）；

wrqm/s：  每秒这个设备相关的写入请求有多少被Merge了。

rsec/s：  每秒读取的扇区数；sectors

wsec/：  每秒写入的扇区数。

**rKB/s：  每秒发送到设备的读取请求数**

**wKB/s：  每秒发送到设备的写入请求数**

avgrq-sz   平均请求扇区的大小

avgqu-sz   平均请求队列的长度。毫无疑问，队列长度越短越好。    

await：    每一个IO请求的处理的平均时间（单位是微秒毫秒）。

svctm      表示平均每次设备I/O操作的服务时间（以毫秒为单位）

**%util：   磁盘利用率**



•可以使用sar命令查看网络的相关统计（sar命令非常复杂，这里仅简单用于统计网络）

语法：sar -n DEV num1 num2

选项：-n，查看网络，DEV表示查看网络接口

num1：刷新间隔（不填就查看一次结束），num2：查看次数（不填无限次数）

如图，查看2次，隔3秒刷新一次，并最终汇总平均记录

![1682600940440](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682600940440.png)

**信息解读：**

•**IFACE 本地网卡接口的名称**

•**rxpck/s 每秒钟接受的数据包**

•**txpck/s 每秒钟发送的数据包**

•**rxKB/S 每秒钟接受的数据包大小，单位为KB**

•**txKB/S 每秒钟发送的数据包大小，单位为KB**

•**rxcmp/s 每秒钟接受的压缩数据包**

•**txcmp/s 每秒钟发送的压缩包**

**•rxmcst/s 每秒钟接收的多播数据包**



# 环境变量

## 环境变量的作用

环境变量是操作系统（Windows、Linux、Mac）在运行的时候，记录的一些关键性信息，用以辅助系统运行。

在Linux系统中执行：env命令即可查看当前系统中记录的环境变量

环境变量是一种KeyValue型结构，即名称和值，如下图：

![1682601343525](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682601343525.png)

**如左图，图中记录了：**

**•HOME**：/home/itheima，用户的HOME路径

**•USER**：itheima，当前的操作用户

**•PWD**：当前工作路径

**•......**

**等等一系列信息，用于辅助系统在运行的时候**

**从环境变量中获取关键信息**

### **环境变量**：PATH

在前面提出的问题中，我们说无论当前工作目录是什么，都能执行/usr/bin/cd这个程序，这个就是借助环境变量中：PATH这个项目的值来做到的。

![1682601456230](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682601456230.png)

PATH记录了系统执行任何命令的搜索路径，如上图记录了（路径之间以:隔开）：

•/usr/local/bin

•/usr/bin

•/usr/local/sbin

•/usr/sbin

•/home/itheima/.local/bin

•/home/itheima/bin

当执行任何命令，都会按照顺序，从上述路径中搜索要执行的程序的本体

比如执行cd命令，就从第二个目录/usr/bin中搜索到了cd命令，并执行

## 符号$的作用

在Linux系统中，$符号被用于取”变量”的值。

环境变量记录的信息，除了给操作系统自己使用外，如果我们想要取用，也可以使用。

取得环境变量的值就可以通过语法：$环境变量名  来取得

比如： echo $PATH

就可以取得PATH这个环境变量的值，并通过echo语句输出出来。

![1682601476506](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682601476506.png)

又或者：echo ${PATH}ABC

![1682601479873](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682601479873.png)

当和其它内容混合在一起的时候，可以通过{}来标注取的变量是谁

## 在Linux中配置环境变量

### **自行设置环境变量**

Linux环境变量可以用户自行设置，其中分为：

•临时设置，语法：export 变量名=变量值

•永久生效

•针对当前用户生效，配置在当前用户的：  ~/.bashrc文件中

•针对所有用户生效，配置在系统的：  /etc/profile文件中

•并通过语法：source 配置文件，进行立刻生效，或重新登录FinalShell生效

![1682601746131](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682601746131.png)

环境变量PATH这个项目里面记录了系统执行命令的搜索路径。

这些搜索路径我们也可以自行添加到PATH中去。



测试：

•在当前HOME目录内创建文件夹，myenv，在文件夹内创建文件mkhaha

•通过vim编辑器，在mkhaha文件内填入：echo 哈哈哈哈哈

完成上述操作后，随意切换工作目录，执行mkhaha命令尝试一下，会发现无法执行



•修改PATH的值

临时修改PATH：export PATH=$PATH:/home/itheima/myenv，再次执行mkhaha，无论在哪里都能执行了

或将export PATH=$PATH:/home/itheima/myenv，填入用户环境变量文件或系统环境变量文件中去



# 上传、下载



## 通过FinalShell在Linux系统中进行上传、下载

我们可以通过FinalShell工具，方便的和虚拟机进行数据交换。

在FinalShell软件的下方窗体中，提供了Linux的文件系统视图，可以方便的：

•浏览文件系统，找到合适的文件，右键点击下载，即可传输到本地电脑

•浏览文件系统，找到合适的目录，将本地电脑的文件拓展进入，即可方便的上传数据到Linux中

![1682640462340](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682640462340.png)

## rz、sz命令

当然，除了通过FinalShell的下方窗体进行文件的传输以外，也可以通过rz、sz命令进行文件传输。

rz、sz命令需要安装，可以通过：yum -y install lrzsz，即可安装。

•rz命令，进行上传，语法：直接输入rz即可

![1682640792445](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682640792445.png)

•sz命令进行下载，语法：sz 要下载的文件

![1682640805970](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682640805970.png)

文件会自动下载到桌面的：fsdownload文件夹中。

**注意，rz、sz命令需要终端软件支持才可正常运行**

**FinalShell、SecureCRT、XShell等常用终端软件均支持此操作**

# 压缩、解压

## 使用tar命令压缩或解压tar或gzip文件

市面上有非常多的压缩格式

•zip格式：Linux、Windows、MacOS，常用

•7zip：Windows系统常用

•rar：Windows系统常用

•tar：Linux、MacOS常用

•gzip：Linux、MacOS常用

在Windows系统中常用的软件如：winrar、bandizip等软件，都支持各类常见的压缩格式，这里不多做讨论。

我们现在要学习，如何在Linux系统中操作：tar、gzip、zip这三种压缩格式

完成文件的压缩、解压操作。

### **tar**命令

Linux和Mac系统常用有2种压缩格式，后缀名分别是：

•.tar，称之为tarball，归档文件，即简单的将文件组装到一个.tar的文件内，并没有太多文件体积的减少，仅仅是简单的封装

•.gz，也常见为.tar.gz，gzip格式压缩文件，即使用gzip压缩算法将文件压缩到一个文件内，可以极大的减少压缩后的体积

针对这两种格式，使用tar命令均可以进行压缩和解压缩的操作

语法：![1682640857337](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682640857337.png)

•-c，创建压缩文件，用于压缩模式

•-v，显示压缩、解压过程，用于查看进度

•-x，解压模式

•-f，要创建的文件，或要解压的文件，-f选项必须在所有选项中位置处于最后一个

•-z，gzip模式，不使用-z就是普通的tarball格式

•-C，选择解压的目的地，用于解压模式



**注意：**

**•-f选项，必须在选项组合体的最后一位**

**•-z选项，建议在开头位置**

**•-C选项单独使用，和解压所需的其它参数分开**



常用的tar解压组合有

•tar -xvf test.tar

解压test.tar，将文件解压至当前目录

•tar -xvf test.tar -C /home/itheima

解压test.tar，将文件解压至指定目录（/home/itheima）

•tar -zxvf test.tar.gz -C /home/itheima

以Gzip模式解压test.tar.gz，将文件解压至指定目录（/home/itheima）



## zip、unzip命令压缩或解压zip文件

### **zip** **命令压缩文件**

可以使用zip命令，压缩文件为zip压缩包

语法：![1682640895607](https://jackchen-note.oss-cn-beijing.aliyuncs.com/Java/linux/1682640895607.png)

•-r，被压缩的包含文件夹的时候，需要使用-r选项，和rm、cp等命令的-r效果一致



示例：

•zip test.zip a.txt b.txt c.txt

将a.txt b.txt c.txt 压缩到test.zip文件内

•zip -r test.zip test itheima a.txt

将test、itheima两个文件夹和a.txt文件，压缩到test.zip文件内

**注意：解压后如果跟源文件夹里面有重名，会直接替换！！！！**

### **unzip** **命令解压文件**

使用unzip命令，可以方便的解压zip压缩包

语法：

•-d，指定要解压去的位置，同tar的-C选项

•参数，被解压的zip压缩包文件



示例：

•unzip test.zip，将test.zip解压到当前目录

•unzip test.zip -d /home/root，将test.zip解压到指定文件夹内（/home/root）