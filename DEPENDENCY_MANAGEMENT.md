# 依赖管理说明 - Internet A2 项目

## 📦 依赖分类

### 🔙 后端依赖（Python）
**管理文件**: `backend/requirements.txt`  
**安装方式**: `pip install -r requirements.txt`  
**虚拟环境**: `backend/venv/`

#### 主要依赖
- `fastapi` - Web 框架
- `uvicorn` - ASGI 服务器
- `sqlalchemy` - ORM
- `pydantic` - 数据验证
- `python-jose[cryptography]` - JWT 认证
- `passlib[bcrypt]` - 密码加密
- `pytest` - 测试框架

---

### 🎨 前端依赖（JavaScript/React）
**管理文件**: `frontend/package.json`  
**安装方式**: `npm install`  
**依赖目录**: `frontend/node_modules/`

#### 主要依赖
- `react` - React 核心库
- `react-dom` - React DOM 渲染
- `react-router-dom` ⭐ **新增** - 路由管理（产品编辑页面）
- `styled-components` - CSS-in-JS 样式
- `axios` - HTTP 客户端
- `vite` - 构建工具

---

## ❓ 常见问题解答

### Q1: react-router-dom 应该放在哪里？

**答案**: 放在 `frontend/package.json` 中，**不是** `backend/requirements.txt`

**原因**:
- `react-router-dom` 是前端 JavaScript 库
- `requirements.txt` 只用于 Python 后端依赖
- `package.json` 用于 Node.js/JavaScript 前端依赖

### Q2: 如何添加新的前端依赖？

```bash
cd frontend
npm install <package-name>
```

例如：
```bash
npm install react-router-dom
npm install lodash
npm install moment
```

这会自动更新 `package.json` 和 `package-lock.json`。

### Q3: 如何添加新的后端依赖？

```bash
cd backend
source venv/bin/activate
pip install <package-name>
pip freeze >> requirements.txt
```

或者手动编辑 `requirements.txt`，然后运行：
```bash
pip install -r requirements.txt
```

### Q4: install.sh 会自动安装所有依赖吗？

**是的！** [install.sh](file:///Users/elliott/vscode_workplace/internet_A2/install.sh) 会：

1. ✅ 安装后端依赖：`pip install -r requirements.txt`
2. ✅ 安装前端依赖：`npm install`（自动读取 `package.json`）
3. ✅ 初始化数据库
4. ✅ 验证所有依赖安装成功

### Q5: restart.sh 需要修改吗？

**不需要！** [restart.sh](file:///Users/elliott/vscode_workplace/internet_A2/restart.sh) 已经正确配置：

- ✅ 检查 `node_modules/` 是否存在
- ✅ 使用 `npm run dev` 启动前端
- ✅ 所有 `package.json` 中的依赖都会自动加载

---

## 🔄 脚本更新总结

### install.sh 的改动

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 项目名称 | Internet A1 | **Internet A2** ✅ |
| 数据库文件 | `internet_a1.db` | **`internet_a2.db`** ✅ |
| 前端依赖提示 | 无 | **添加 react-router-dom 说明** ✅ |
| 完成提示 | 简单信息 | **详细的使用说明** ✅ |

### restart.sh 的改动

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 项目名称 | Internet A1 | **Internet A2** ✅ |
| 数据库检查 | `internet_a1.db` | **`internet_a2.db`** ✅ |
| 前端特性说明 | 无 | **列出主要功能** ✅ |

---

## 📋 完整的依赖清单

### Backend (requirements.txt)
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pytest==7.4.3
httpx==0.25.2
alembic==1.12.1
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",  // ⭐ 新增
    "styled-components": "^6.1.1",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🚀 快速开始

### 全新安装
```bash
./install.sh
```

### 重启服务
```bash
./restart.sh
```

### 跳过测试重启（开发模式）
```bash
./restart.sh --skip-tests
```

### 清理环境
```bash
./cleanup.sh
```

---

## ⚠️ 注意事项

1. **不要混用依赖管理器**
   - ❌ 不要用 `pip` 安装前端包
   - ❌ 不要用 `npm` 安装后端包
   - ✅ 后端用 `pip` + `requirements.txt`
   - ✅ 前端用 `npm` + `package.json`

2. **版本控制**
   - ✅ 提交 `requirements.txt`
   - ✅ 提交 `package.json`
   - ✅ 提交 `package-lock.json`
   - ❌ 不要提交 `node_modules/`
   - ❌ 不要提交 `venv/`

3. **依赖冲突**
   - 如果遇到依赖冲突，删除 `node_modules/` 和 `package-lock.json`，重新运行 `npm install`
   - 后端冲突时，删除 `venv/`，重新运行 `install.sh`

---

## 📝 变更记录

### 2026-04-29 - v2.0
- ✅ 添加 `react-router-dom` 到前端依赖
- ✅ 更新 `install.sh` 为 A2 项目
- ✅ 更新 `restart.sh` 为 A2 项目
- ✅ 数据库文件从 `internet_a1.db` 改为 `internet_a2.db`
- ✅ 添加产品编辑功能的路由支持

---

*最后更新: 2026-04-29*  
*项目版本: Internet A2 v2.0*
