import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, request } from '@umijs/max';
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Tag,
} from 'antd';
import { useState } from 'react';

const UserList = () => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  // 添加用户相关状态
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [addUserForm] = Form.useForm();

  const handleSetPassword = (user: any) => {
    setSelectedUser(user);
    setPasswordModalVisible(true);
    setNewPassword('');
  };

  const handlePasswordSubmit = async () => {
    try {
      await request(`/admin/users/${selectedUser.id}/password`, {
        method: 'PUT',
        data: { password: newPassword },
      });
      message.success('密码设置成功');
      setPasswordModalVisible(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      message.error('密码设置失败');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await request(`/users/${userId}`, {
        method: 'DELETE',
      });
      message.success('用户已归档');
    } catch (error) {
      message.error('用户归档失败');
    }
  };

  const handleRestore = async (userId: string) => {
    try {
      await request(`/users/${userId}/restore`, {
        method: 'PATCH',
      });
      message.success('用户已取消归档');
    } catch (error) {
      message.error('用户取消归档失败');
    }
  };

  const handleAddUser = async (values: any) => {
    try {
      const userData = {
        ...values,
        id: Date.now().toString(), // 生成临时ID
        status: 'active',
        createTime: new Date().toLocaleDateString(),
        isDeleted: false,
      };

      await request('/users', {
        method: 'POST',
        data: userData,
      });
      message.success('用户添加成功');
      setAddUserModalVisible(false);
      addUserForm.resetFields();
      // 刷新表格
      window.location.reload();
    } catch (error) {
      message.error('用户添加失败');
    }
  };

  const handleViewDetail = (userId: string) => {
    history.push(`/users/${userId}`);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (username: string, record: any) => (
        <a onClick={() => handleViewDetail(record.id)}>{username}</a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '个人信息',
      key: 'profile',
      width: 300,
      render: (record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={40}
            src={record.avatar || '/images/default-avatar.png'}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div>
              <strong>姓名:</strong> {record.name}
            </div>
            {record.company && (
              <div>
                <strong>公司:</strong> {record.company}
              </div>
            )}
            {record.position && (
              <div>
                <strong>职位:</strong> {record.position}
              </div>
            )}
            {record.industry && (
              <div>
                <strong>行业:</strong> {record.industry}
              </div>
            )}
            {record.phone && (
              <div>
                <strong>电话:</strong> {record.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: any) => (
        <div>
          <Button
            type="link"
            size="small"
            onClick={() => handleSetPassword(record)}
          >
            设置密码
          </Button>
          <Popconfirm
            title="确定要归档这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              归档
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={async () => {
          const response = await request('/admin/user-list');
          return {
            data: response.data,
            success: response.code === 200,
            total: response.data.length,
          };
        }}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddUserModalVisible(true)}
          >
            添加用户
          </Button>,
        ]}
      />
      <Modal
        title="设置密码"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => setPasswordModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <div>
          <p>用户: {selectedUser?.username}</p>
          <div style={{ marginTop: 16 }}>
            <label>新密码:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '8px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
              }}
              placeholder="请输入新密码"
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="添加用户"
        open={addUserModalVisible}
        onCancel={() => {
          setAddUserModalVisible(false);
          addUserForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={addUserForm} onFinish={handleAddUser} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话（可选）" />
          </Form.Item>

          <Form.Item name="avatar" label="头像URL">
            <Input placeholder="请输入头像链接（可选）" />
          </Form.Item>

          <Form.Item name="company" label="公司">
            <Input placeholder="请输入公司（可选）" />
          </Form.Item>

          <Form.Item name="position" label="职位">
            <Input placeholder="请输入职位（可选）" />
          </Form.Item>

          <Form.Item name="department" label="部门">
            <Input placeholder="请输入部门（可选）" />
          </Form.Item>

          <Form.Item name="industry" label="行业">
            <Select placeholder="请选择行业（可选）" allowClear>
              <Select.Option value="互联网">互联网</Select.Option>
              <Select.Option value="金融">金融</Select.Option>
              <Select.Option value="教育">教育</Select.Option>
              <Select.Option value="医疗">医疗</Select.Option>
              <Select.Option value="制造业">制造业</Select.Option>
              <Select.Option value="房地产">房地产</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="profession" label="职业">
            <Input placeholder="请输入职业（可选）" />
          </Form.Item>

          <Form.Item name="wechatId" label="微信号">
            <Input placeholder="请输入微信号（可选）" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              添加
            </Button>
            <Button
              onClick={() => {
                setAddUserModalVisible(false);
                addUserForm.resetFields();
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UserList;
