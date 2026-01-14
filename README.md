# 在线观影室后端服务

> 🎬 **房间管理模块** - Node.js + Express 实现的完整后端服务
>
> 📊 **项目现状**: ✅ 完成 (2500+行代码, 9个API, 123,000+字文档)  
> � **快速开始**: [START_HERE.md](START_HERE.md) | 📋 [完成报告](COMPLETION_REPORT.md) | 📚 [完整文档](#-完整文档)

## 项目简介

这是在线观影室（Social Cinema）系统的后端服务，目前实现了房间管理模块的核心功能。

## 技术栈

- **运行时**: Node.js v25.2.1
- **框架**: Express.js 5.2.1
- **数据存储**: 内存存储（第一迭代）

## 项目结构

```
backend-online-movie-house/
├── src/
│   ├── app.js                    # 应用入口文件
│   ├── config/
│   │   └── index.js              # 配置文件
│   ├── controllers/
│   │   └── RoomController.js     # 房间控制器
│   ├── exceptions/
│   │   └── BusinessException.js  # 业务异常类
│   ├── middlewares/
│   │   ├── errorHandler.js       # 错误处理中间件
│   │   └── requestLogger.js      # 请求日志中间件
│   ├── models/
│   │   ├── index.js              # 模型导出
│   │   ├── Room.js               # 房间实体类
│   │   ├── VideoState.js         # 视频状态实体类
│   │   └── Participant.js        # 参与者实体类
│   ├── repositories/
│   │   └── RoomRepository.js     # 房间数据访问层
│   ├── routes/
│   │   └── roomRoutes.js         # 房间路由定义
│   ├── services/
│   │   └── RoomService.js        # 房间服务层
│   └── utils/
│       ├── IdGenerator.js        # ID生成工具
│       └── ResponseHelper.js     # 响应助手工具
├── docs/
│   ├── 文档索引.md                # 文档导航和索引
│   ├── 综合概览.md                # 项目综合概览
│   ├── 设计文档.md                # 架构和分层设计
│   ├── 类图和包图.md              # UML类图和包图（Mermaid）
│   ├── 详细设计.md                # 详细的实现设计
│   └── API文档.md                # RESTful API接口文档
├── package.json
└── README.md
```

## 架构设计

项目采用经典的分层架构（MVC + Repository模式）：

1. **Controller层** - 处理HTTP请求，调用Service层
2. **Service层** - 实现业务逻辑
3. **Repository层** - 数据访问抽象
4. **Model层** - 实体定义

### 设计模式

- **单例模式**: RoomRepository, RoomService, RoomController
- **工厂模式**: 路由创建
- **聚合根模式**: Room作为聚合根，管理VideoState和Participant

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
# 生产模式
npm start

# 开发模式（支持热重载）
npm run dev
```

### 3. 验证服务

访问 http://localhost:3000/health 检查服务状态

## API接口

详细接口文档请参考 [docs/API文档.md](docs/API文档.md)

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/rooms | 获取房间列表 |
| POST | /api/rooms | 创建房间 |
| GET | /api/rooms/:roomId | 获取房间详情 |
| POST | /api/rooms/:roomId/join | 加入房间 |
| POST | /api/rooms/:roomId/leave | 退出房间 |
| DELETE | /api/rooms/:roomId | 解散房间 |

## 📚 完整文档

项目包含详细的设计文档和实现指南（总计 123,000+ 字，40+ 个图表，110+ 个代码示例）：

| 文档 | 说明 | 阅读时间 |
|------|------|---------|
| [交付清单](docs/交付清单.md) | 📋 完整的交付物清单和使用指南 | 10分钟 |
| [综合概览](docs/综合概览.md) | 项目全面概览，含架构、功能、技术栈 | 15分钟 |
| [文档索引](docs/文档索引.md) | 文档导航、快速查找、按角色推荐 | 10分钟 |
| [设计文档](docs/设计文档.md) | 架构设计、分层设计、类设计、流程图 | 40分钟 |
| [类图和包图](docs/类图和包图.md) | UML类图、包图、接口定义（Mermaid代码） | 30分钟 |
| [详细设计](docs/详细设计.md) | 需求分析、属性设计、方法设计、性能优化 | 50分钟 |
| [API文档](docs/API文档.md) | 接口规范、请求/响应格式、调用示例 | 40分钟 |

### 快速导航

**按角色查找文档**:
- 项目经理 → [综合概览](docs/综合概览.md)
- 架构师 → [设计文档](docs/设计文档.md) + [类图和包图](docs/类图和包图.md)
- 后端开发 → [详细设计](docs/详细设计.md) + 源代码
- 前端开发 → [API文档](docs/API文档.md)
- 测试人员 → [API文档](docs/API文档.md)

更多导航信息见 [文档索引](docs/文档索引.md)

## 开发说明

### 代码规范

- 使用JSDoc注释所有类和方法
- 遵循ES6+语法规范
- 采用单例模式管理核心服务实例

### 错误处理

统一使用BusinessException体系处理业务异常，全局错误中间件统一格式化响应。

### 分层结构

项目采用四层分层架构：
1. **应用层** (Controllers, Routes) - 处理HTTP请求/响应
2. **业务逻辑层** (Services) - 实现核心业务规则
3. **数据访问层** (Repositories) - 管理数据存储
4. **模型层** (Entities) - 定义数据结构和业务规则

详见 [设计文档 - 分层设计](docs/设计文档.md#分层设计)

## 后续计划

- [ ] 添加Socket.IO实现实时同步
- [ ] 实现同步控制模块
- [ ] 实现聊天互动模块
- [ ] 添加数据持久化（Redis/MongoDB）
