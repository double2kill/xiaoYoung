import {
  addGroupMember,
  createGroup,
  deleteGroup,
  getGroupMembers,
  getGroupsList,
  getUserList,
  removeGroupMember,
  updateGroup,
  updateMemberStatus,
  type GroupItem,
  type GroupMemberItem,
  type UserItem,
} from '@/services/groups';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Popconfirm, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

const Groups: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroupItem | null>(null);

  // 成员管理相关状态
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string>('');
  const [members, setMembers] = useState<GroupMemberItem[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);

  // 用户选择相关状态
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteGroup(id);
      if (result.code === 200) {
        message.success('归档成功');
        actionRef.current?.reload();
      } else {
        message.error('归档失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        createdBy: 'admin',
      };

      let result;
      if (editingItem) {
        result = await updateGroup(editingItem._id, data);
      } else {
        result = await createGroup(data);
      }

      if (result.code === 200) {
        message.success(editingItem ? '更新成功' : '创建成功');
        setModalVisible(false);
        setEditingItem(null);
        actionRef.current?.reload();
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const handleEdit = (record: GroupItem) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleMemberManage = async (record: GroupItem) => {
    setCurrentGroupId(record._id);
    setMemberModalVisible(true);
    await fetchGroupMembers(record._id);
  };

  const fetchGroupMembers = async (groupId: string) => {
    setMemberLoading(true);
    try {
      const result = await getGroupMembers(groupId);
      if (result.code === 200) {
        setMembers(result.data);
      } else {
        message.error('获取成员列表失败');
        setMembers([]);
      }
    } catch (error) {
      message.error('网络错误');
      setMembers([]);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleAddMember = async (values: any) => {
    try {
      console.log('添加成员参数:', values);
      const result = await addGroupMember(currentGroupId, {
        userId: values.userId,
        role: values.role,
      });
      console.log('添加成员结果:', result);
      if (result.code === 200) {
        message.success('添加成员成功');
        setAddMemberModalVisible(false);
        fetchGroupMembers(currentGroupId);
      } else {
        message.error(result.message || '添加成员失败');
      }
    } catch (error) {
      console.error('添加成员错误:', error);
      message.error('网络错误');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const result = await removeGroupMember(currentGroupId, userId);
      if (result.code === 200) {
        message.success('移除成员成功');
        fetchGroupMembers(currentGroupId);
      } else {
        message.error('移除成员失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      console.log('开始获取用户列表...');
      const result = await getUserList();
      console.log('用户列表API响应:', result);
      if (result.code === 200) {
        setUsers(result.data);
        console.log('用户列表设置成功，用户数量:', result.data?.length || 0);
      } else {
        console.error('获取用户列表失败:', result.message);
        message.error('获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表网络错误:', error);
      message.error('网络错误');
    } finally {
      setUserLoading(false);
    }
  };

  const renderStatus = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderMembers = (members: GroupItem['members']) => {
    return (
      <div>
        <div>总成员: {members.length}</div>
        <div>管理员: {members.filter((m) => m.role === 'admin').length}</div>
        <div>普通成员: {members.filter((m) => m.role === 'member').length}</div>
      </div>
    );
  };

  const columns: ProColumns<GroupItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'groupType',
      key: 'groupType',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => renderStatus(record.status),
    },
    {
      title: '成员信息',
      dataIndex: 'members',
      key: 'members',
      width: 150,
      render: (_, record) => renderMembers(record.members),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, record) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleMemberManage(record)}
          >
            成员管理
          </Button>
          <Popconfirm
            title="确定要归档这个圈子吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              归档
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<GroupItem>
        actionRef={actionRef}
        columns={columns}
        request={async () => {
          const result = await getGroupsList();
          return {
            data: result.data || [],
            success: result.code === 200,
            total: result.data?.length || 0,
          };
        }}
        rowKey="_id"
        search={false}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建圈子
          </Button>,
        ]}
      />

      {/* 圈子编辑模态框 */}
      <Modal
        title={editingItem ? '编辑圈子' : '新建圈子'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        footer={null}
        width={600}
      >
        <ProForm
          onFinish={handleSubmit}
          initialValues={editingItem}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: editingItem ? '更新' : '创建',
            },
          }}
        >
          <ProFormText
            name="name"
            label="圈子名称"
            rules={[{ required: true, message: '请输入圈子名称' }]}
            placeholder="请输入圈子名称"
          />
          <ProFormTextArea
            name="description"
            label="圈子描述"
            rules={[{ required: true, message: '请输入圈子描述' }]}
            placeholder="请输入圈子描述"
            fieldProps={{ rows: 4 }}
          />
          <ProFormSelect
            name="groupType"
            label="圈子类型"
            rules={[{ required: true, message: '请选择圈子类型' }]}
            options={[
              { label: '兴趣小组', value: 'interest' },
              { label: '专业圈子', value: 'professional' },
              { label: '地区圈子', value: 'regional' },
              { label: '其他', value: 'other' },
            ]}
            placeholder="请选择圈子类型"
          />
          <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
              { label: '待审核', value: 'pending' },
              { label: '已通过', value: 'approved' },
              { label: '已拒绝', value: 'rejected' },
            ]}
            initialValue="pending"
          />
        </ProForm>
      </Modal>

      {/* 成员管理模态框 */}
      <Modal
        title="成员管理"
        open={memberModalVisible}
        onCancel={() => {
          setMemberModalVisible(false);
          setCurrentGroupId('');
          setMembers([]);
        }}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddMemberModalVisible(true);
              fetchUsers();
            }}
          >
            添加成员
          </Button>
        </div>
        <ProTable<GroupMemberItem>
          dataSource={members}
          loading={memberLoading}
          rowKey="_id"
          search={false}
          pagination={false}
          columns={[
            {
              title: '用户信息',
              dataIndex: 'user',
              key: 'user',
              render: (_, record) => (
                <div>
                  <div>
                    <strong>{record.user?.name || '未知用户'}</strong>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    用户名: {record.user?.username || ''}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    邮箱: {record.user?.email || ''}
                  </div>
                  {record.user?.company && (
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      公司: {record.user.company} - {record.user.position}
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: '角色',
              dataIndex: 'role',
              key: 'role',
              render: (role: string) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                  {role === 'admin' ? '管理员' : '成员'}
                </Tag>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'approved' ? 'green' : 'orange'}>
                  {status === 'approved' ? '已批准' : '待审核'}
                </Tag>
              ),
            },
            {
              title: '加入时间',
              dataIndex: 'joinedAt',
              key: 'joinedAt',
              render: (text: string) => new Date(text).toLocaleString(),
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Space>
                  {record.status === 'pending' && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        updateMemberStatus(currentGroupId, record.user?._id, {
                          status: 'approved',
                        }).then(() => {
                          message.success('审批成功');
                          fetchGroupMembers(currentGroupId);
                        })
                      }
                    >
                      批准
                    </Button>
                  )}
                  <Popconfirm
                    title="确定要移除这个成员吗？"
                    onConfirm={() => handleRemoveMember(record.user?._id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="link" size="small" danger>
                      移除
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Modal>

      {/* 添加成员模态框 */}
      <Modal
        title="添加成员"
        open={addMemberModalVisible}
        onCancel={() => setAddMemberModalVisible(false)}
        footer={null}
        width={500}
      >
        <ProForm
          onFinish={handleAddMember}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '添加',
            },
          }}
        >
          <ProFormRadio.Group
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
            options={[
              { label: '成员', value: 'member' },
              { label: '管理员', value: 'admin' },
            ]}
            initialValue="member"
          />

          <ProFormSelect
            name="userId"
            label="选择用户"
            rules={[{ required: true, message: '请选择用户' }]}
            options={users.map((user) => {
              console.log('生成用户选项:', user);
              return {
                label: (
                  <div>
                    <div>
                      <strong>{user.name}</strong>
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {user.email}
                    </div>
                    {user.company && (
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        {user.company} - {user.position}
                      </div>
                    )}
                  </div>
                ),
                value: user.id ? user.id.toString() : '',
              };
            })}
            placeholder="请选择用户"
            fieldProps={{
              loading: userLoading,
              showSearch: true,
              filterOption: (input, option) =>
                option?.label?.props?.children?.[0]?.props?.children
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase()),
            }}
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default Groups;
