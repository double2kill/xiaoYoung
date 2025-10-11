# 管理后台功能文档

## 一、审核管理功能

### 1. 动态列表状态筛选

- **位置**: `/admin/src/pages/Dynamics/index.tsx`
- **功能**:
  - 支持按状态筛选动态（已发布、草稿、隐藏、待审核、已审核、已拒绝）
  - 搜索框支持状态下拉选择
  - 状态标签使用不同颜色区分

### 2. 圈子详情管理员模式

- **位置**: `/admin/src/pages/Groups/Detail/index.tsx`
- **功能**:
  - 页面右上角管理员模式开关
  - 管理员模式下，活动和动态列表增加"审核操作"列
  - 普通模式下隐藏审核功能

### 3. 活动审核功能

- **位置**: 圈子详情 > 活动列表 Tab
- **功能**:
  - 管理员可以通过/拒绝待审核的活动
  - 审核后即时刷新列表
  - 已通过/已拒绝的活动显示状态，不可再审核

### 4. 动态审核功能

- **位置**: 圈子详情 > 动态列表 Tab
- **功能**:
  - 管理员可以通过/拒绝待审核的动态
  - 审核后即时刷新列表
  - 已通过/已拒绝的动态显示状态，不可再审核

## 二、数据过滤

### 1. 归档数据过滤

- **实现位置**:
  - `/admin/src/pages/Groups/Detail/index.tsx` - fetchEvents(), fetchDynamics()
- **功能**:
  - 圈子详情中自动过滤已归档的活动和动态
  - 只展示 `isDeleted: false` 的数据

### 2. 状态筛选

- **API 支持**:
  - `/api/src/controllers/dynamics.controller.ts`
  - `/api/src/services/dynamics.service.ts`
- **功能**:
  - API 层支持 status 参数筛选
  - 前端支持多状态选择筛选

## 三、通用组件

### 1. ApprovalActions 组件

- **位置**: `/admin/src/components/ApprovalActions/index.tsx`
- **功能**:
  - 统一的审核操作组件
  - 支持活动和动态两种类型
  - 根据状态自动显示/隐藏操作按钮
  - 带确认对话框防止误操作

**使用方式**:

```tsx
<ApprovalActions
  itemId={record._id}
  itemType="event" // 或 "dynamic"
  status={record.status}
  onApprove={handleApproveEvent}
  onReject={handleRejectEvent}
/>
```

### 2. useAdminMode Hook

- **位置**: `/admin/src/hooks/useAdminMode.ts`
- **功能**:
  - 管理管理员模式状态
  - 提供切换方法

**使用方式**:

```tsx
const { isAdminMode, toggleMode, setIsAdminMode } = useAdminMode(false);
```

## 四、API 接口更新

### 1. Dynamics Controller

- `GET /admin/dynamics` - 支持 status 参数筛选
- `GET /admin/dynamics/:id` - 获取单个动态详情
- `PATCH /admin/dynamics/:id` - 更新动态状态
- `DELETE /admin/dynamics/:id` - 归档动态

### 2. Events Controller

- `GET /admin/events` - 获取活动列表
- `PATCH /admin/events/:id` - 更新活动状态（包括审核）

### 3. 数据格式

所有接口统一返回格式：

```json
{
  "code": 200,
  "data": [...],
  "message": "操作成功"
}
```

## 五、最佳实践

### 1. 组件复用

- ApprovalActions 组件可用于任何需要审核功能的地方
- useAdminMode hook 可用于任何需要模式切换的页面

### 2. 状态管理

- 使用 React hooks 进行本地状态管理
- 审核操作后立即刷新列表

### 3. 用户体验

- 操作带确认对话框
- 操作后即时反馈（message 提示）
- 已审核的项目显示状态，不可重复操作

### 4. 数据安全

- 归档数据不删除，只标记 isDeleted
- 支持多重筛选条件
- 前后端双重数据过滤

## 六、功能扩展

如需在其他页面添加审核功能：

1. 引入组件和 hook：

```tsx
import ApprovalActions from '@/components/ApprovalActions';
import { useAdminMode } from '@/hooks/useAdminMode';
```

2. 添加模式切换：

```tsx
const { isAdminMode, toggleMode } = useAdminMode(false);

<Switch checked={isAdminMode} onChange={toggleMode} />;
```

3. 在表格列中添加审核操作：

```tsx
...(isAdminMode ? [{
  title: '审核操作',
  key: 'approval',
  render: (_, record) => (
    <ApprovalActions
      itemId={record._id}
      itemType="your_type"
      status={record.status}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  ),
}] : [])
```

## 七、注意事项

1. **性能优化**: 大数据量时建议添加分页和虚拟滚动
2. **权限控制**: 后续可结合用户角色进行权限验证
3. **日志记录**: 重要操作建议添加操作日志
4. **批量操作**: 可扩展批量审核功能
