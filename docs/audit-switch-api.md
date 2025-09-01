# 审核开关系统接口文档

## 概述

审核开关系统用于小程序审核期间的功能控制。系统采用双开关机制（开关A和开关B），每个应用ID只维护一条配置记录。开发环境下直接返回true，生产环境下根据指定的开关参数返回对应的开关状态。

## 核心概念

### 双开关机制
- **开关A (switchA)**: 第一个开关，布尔值
- **开关B (switchB)**: 第二个开关，布尔值
- **激活开关 (activeSwitch)**: 当前生效的开关标识（A或B）
- **环境隔离**: 开发环境始终返回true，生产环境返回指定开关的实际状态

### 数据模型
每个应用ID只有一条记录，包含以下字段：
- `appId`: 应用标识
- `environment`: 环境（develop/dev返回true，其他环境返回开关值）
- `switchA`: 开关A的状态（true/false）
- `switchB`: 开关B的状态（true/false）
- `activeSwitch`: 当前激活的开关（A或B）
- `description`: 配置描述
- `updatedBy`: 最后更新人
- `updatedAt`: 更新时间
- `createdAt`: 创建时间

## API接口

### 基础路径
```
BASE_URL: /api/audit-switch
```

### 1. 获取开关状态

**接口**: `GET /status`

**描述**: 获取指定开关的状态，小程序调用此接口决定功能显示

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appId | String | 是 | 应用ID |
| switchParam | String | 是 | 开关参数：A或B |

**请求示例**:
```http
GET /api/audit-switch/status?appId=miniapp&switchParam=A
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取开关状态成功",
  "data": true,
  "success": true
}
```

**业务逻辑**:
- 如果环境是 "develop" 或 "dev"，直接返回 `true`
- 否则返回指定开关（A或B）的实际状态值

### 2. 初始化配置

**接口**: `POST /init`

**描述**: 初始化审核开关配置，为指定应用创建默认配置

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appId | String | 是 | 应用ID |
| environment | String | 是 | 环境标识 |
| description | String | 否 | 配置描述 |
| updatedBy | String | 是 | 操作人员 |

**请求示例**:
```http
POST /api/audit-switch/init
Content-Type: application/json

{
  "appId": "miniapp",
  "environment": "prod",
  "description": "小程序生产环境配置",
  "updatedBy": "admin"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "初始化成功",
  "data": {
    "id": 1,
    "appId": "miniapp",
    "environment": "prod",
    "switchA": false,
    "switchB": false,
    "activeSwitch": "A",
    "description": "小程序生产环境配置",
    "updatedBy": "admin",
    "createdAt": "2024-01-20T10:00:00",
    "updatedAt": "2024-01-20T10:00:00"
  },
  "success": true
}
```

### 3. 更新开关状态

**接口**: `PUT /status`

**描述**: 更新指定开关的状态或切换开关状态

#### 3.1 更新指定开关状态

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appId | String | 是 | 应用ID |
| switchParam | String | 是 | 开关参数：A或B |
| status | Boolean | 是 | 开关状态 |
| updatedBy | String | 是 | 操作人员 |

**请求示例**:
```http
PUT /api/audit-switch/status
Content-Type: application/json

{
  "appId": "miniapp",
  "switchParam": "A",
  "status": true,
  "updatedBy": "admin"
}
```

#### 3.2 切换开关状态（反转A和B）

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appId | String | 是 | 应用ID |

**请求示例**:
```http
PUT /api/audit-switch/status
Content-Type: application/json

{
  "appId": "miniapp"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null,
  "success": true
}
```

### 4. 更新环境

**接口**: `PUT /environment`

**描述**: 更新配置的环境标识

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appId | String | 是 | 应用ID |
| environment | String | 是 | 新的环境标识 |
| updatedBy | String | 是 | 操作人员 |

**请求示例**:
```http
PUT /api/audit-switch/environment
Content-Type: application/json

{
  "appId": "miniapp",
  "environment": "prod",
  "updatedBy": "admin"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新环境成功",
  "data": null,
  "success": true
}
```

## 使用场景

### 小程序端集成

#### JavaScript示例
```javascript
// 获取审核开关状态
async function getAuditSwitchStatus(switchParam = 'A') {
  try {
    const response = await wx.request({
      url: 'https://your-domain.com/api/audit-switch/status',
      method: 'GET',
      data: {
        appId: 'miniapp',
        switchParam: switchParam
      }
    });
    
    const { success, data } = response.data;
    if (success) {
      // data为true时显示完整功能，false时隐藏敏感功能
      return data;
    }
    return false; // 默认关闭
  } catch (error) {
    console.error('获取审核开关状态失败:', error);
    return false; // 异常时默认关闭
  }
}

// 在页面加载时调用
Page({
  async onLoad() {
    const showSensitiveFeatures = await getAuditSwitchStatus('A');
    this.setData({
      showPayment: showSensitiveFeatures,
      showVip: showSensitiveFeatures,
      showReward: showSensitiveFeatures
    });
  }
});
```

### 运维操作流程

#### 1. 首次部署
```bash
# 初始化配置
POST /api/audit-switch/init
{
  "appId": "miniapp",
  "environment": "prod",
  "description": "小程序生产环境配置",
  "updatedBy": "system"
}
```

#### 2. 审核前准备
```bash
# 设置开关A为关闭状态（用于审核）
PUT /api/audit-switch/status
{
  "appId": "miniapp",
  "switchParam": "A",
  "status": false,
  "updatedBy": "admin"
}

# 设置开关B为开启状态（审核通过后使用）
PUT /api/audit-switch/status
{
  "appId": "miniapp",
  "switchParam": "B",
  "status": true,
  "updatedBy": "admin"
}
```

#### 3. 审核通过后切换
```bash
# 小程序端改为请求开关B
# 或者反转开关状态
PUT /api/audit-switch/status
{
  "appId": "miniapp"
}
```

## 错误码说明

| 错误情况 | code | success | message |
|----------|------|---------|----------|
| 配置不存在 | 404 | false | "配置不存在" |
| 参数错误 | 400 | false | "参数错误" |
| 系统异常 | 500 | false | "系统异常: 具体错误信息" |
| 操作成功 | 200 | true | "操作成功" |

## 注意事项

1. **环境判断**: 开发环境（develop/dev）始终返回true，不受开关控制
2. **数据唯一性**: 每个appId只维护一条配置记录
3. **异常处理**: 接口异常时默认返回false，确保审核安全
4. **操作日志**: 所有配置变更都会记录操作人员和时间
5. **开关切换**: 支持单独更新开关状态或批量反转A、B开关状态

## 监控建议

1. **接口监控**: 监控/status接口的调用频率和响应时间
2. **状态监控**: 定期检查生产环境开关配置是否符合预期
3. **切换记录**: 记录每次开关切换的时间和操作人员
4. **异常告警**: 当接口返回异常时及时告警