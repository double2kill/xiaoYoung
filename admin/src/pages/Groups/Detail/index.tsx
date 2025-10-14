import ApprovalActions from '@/components/ApprovalActions';
import { useAdminMode } from '@/hooks';
import {
  getDynamicsList,
  updateDynamic,
  type DynamicItem,
} from '@/services/dynamics';
import {
  getEventsList,
  updateEventStatus,
  type EventItem,
} from '@/services/events';
import {
  addGroupMember,
  getGroupDetail,
  getGroupMembers,
  getUserList,
  removeGroupMember,
  updateMemberRole,
  updateMemberStatus,
  type GroupItem,
  type GroupMemberItem,
  type UserItem,
} from '@/services/groups';
import {
  CrownOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Tabs,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdminMode, setIsAdminMode } = useAdminMode(true);
  const memberActionRef = useRef<ActionType>();
  const [groupInfo, setGroupInfo] = useState<GroupItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [dynamics, setDynamics] = useState<DynamicItem[]>([]);
  const [dynamicLoading, setDynamicLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroupDetail();
      fetchEvents();
      fetchDynamics();
      fetchMemberCount();
    }
  }, [id]);

  const fetchMemberCount = async () => {
    try {
      const result = await getGroupMembers(id!);
      if (result.code === 200) {
        setMemberCount(result.data?.length || 0);
      }
    } catch (error) {
      console.error('获取成员数量失败:', error);
    }
  };

  const fetchGroupDetail = async () => {
    setLoading(true);
    try {
      const result = await getGroupDetail(id!);
      if (result.code === 200) {
        setGroupInfo(result.data);
      } else {
        message.error('获取圈子详情失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const result = await removeGroupMember(id!, userId);
      if (result.code === 200) {
        message.success('移除成员成功');
        memberActionRef.current?.reload();
        fetchMemberCount();
      } else {
        message.error('移除成员失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const handleSetAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      const result = await updateMemberRole(id!, userId, { role: newRole });
      if (result.code === 200) {
        message.success(
          newRole === 'admin' ? '设置管理员成功' : '取消管理员成功',
        );
        memberActionRef.current?.reload();
      } else {
        message.error(result.message || '角色更新失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const handleApproveMember = async (userId: string) => {
    try {
      const result = await updateMemberStatus(id!, userId, {
        status: 'approved',
      });
      if (result.code === 200) {
        message.success('审批成功');
        memberActionRef.current?.reload();
      } else {
        message.error('审批失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const result = await getUserList();
      if (result.code === 200) {
        setUsers(result.data);
      } else {
        message.error('获取用户列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setUserLoading(false);
    }
  };

  const handleAddMember = async (values: any) => {
    try {
      const result = await addGroupMember(id!, {
        userId: values.userId,
        role: values.role,
      });
      if (result.code === 200) {
        message.success('添加成员成功');
        setAddMemberModalVisible(false);
        memberActionRef.current?.reload();
        fetchMemberCount();
      } else {
        message.error(result.message || '添加成员失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const fetchEvents = async () => {
    setEventLoading(true);
    try {
      const result = await getEventsList({ groupId: id });
      if (result.code === 200) {
        const filteredEvents = result.data.filter(
          (event: any) => !event.isDeleted,
        );
        setEvents(filteredEvents);
      } else {
        message.error('获取活动列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setEventLoading(false);
    }
  };

  const fetchDynamics = async () => {
    setDynamicLoading(true);
    try {
      const result = await getDynamicsList({ groupId: id });
      if (result.code === 200) {
        const filteredDynamics = result.data.filter(
          (dynamic: any) => !dynamic.isDeleted,
        );
        setDynamics(filteredDynamics);
      } else {
        message.error('获取动态列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setDynamicLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    await updateEventStatus(eventId, { status: 'approved' });
    fetchEvents();
  };

  const handleRejectEvent = async (eventId: string) => {
    await updateEventStatus(eventId, { status: 'rejected' });
    fetchEvents();
  };

  const handleTakedownEvent = async (eventId: string) => {
    await updateEventStatus(eventId, { status: 'rejected' });
    fetchEvents();
  };

  const handleApproveDynamic = async (dynamicId: string) => {
    await updateDynamic(dynamicId, { status: 'approved' });
    fetchDynamics();
  };

  const handleRejectDynamic = async (dynamicId: string) => {
    await updateDynamic(dynamicId, { status: 'rejected' });
    fetchDynamics();
  };

  const handleTakedownDynamic = async (dynamicId: string) => {
    await updateDynamic(dynamicId, { status: 'rejected' });
    fetchDynamics();
  };

  const renderStatus = (status: string) => {
    const statusMap = {
      published: { color: 'green', text: '已发布' },
      draft: { color: 'orange', text: '草稿' },
      hidden: { color: 'red', text: '隐藏' },
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' },
    };
    const config = statusMap[status as keyof typeof statusMap] || {
      color: 'default',
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderEventStatus = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' },
    };
    const config = statusMap[status as keyof typeof statusMap] || {
      color: 'default',
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 根据视角过滤数据
  const filteredEvents = isAdminMode
    ? events
    : events.filter((event) => event.status === 'approved');

  const filteredDynamics = isAdminMode
    ? dynamics
    : dynamics.filter((dynamic) => dynamic.status === 'approved');

  return (
    <PageContainer
      loading={loading}
      header={{
        title: groupInfo?.name || '圈子详情',
        onBack: () => history.back(),
        extra: [
          <Radio.Group
            key="mode-switch"
            value={isAdminMode ? 'admin' : 'user'}
            onChange={(e) => setIsAdminMode(e.target.value === 'admin')}
            buttonStyle="solid"
          >
            <Radio.Button value="admin">
              <Space size="small">
                <CrownOutlined />
                管理员视角
              </Space>
            </Radio.Button>
            <Radio.Button value="user">
              <Space size="small">
                <UserOutlined />
                普通用户视角
              </Space>
            </Radio.Button>
          </Radio.Group>,
        ],
      }}
    >
      <ProCard title="基本信息" style={{ marginBottom: 16 }}>
        <ProDescriptions
          column={2}
          dataSource={groupInfo}
          columns={[
            {
              title: '圈子名称',
              dataIndex: 'name',
            },
            {
              title: '圈子类型',
              dataIndex: 'groupType',
              render: (text) => {
                const typeMap = {
                  interest: '兴趣小组',
                  professional: '专业圈子',
                  regional: '地区圈子',
                  other: '其他',
                };
                return typeMap[text as keyof typeof typeMap] || text;
              },
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (text) => renderStatus(text as string),
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              render: (text) =>
                dayjs(text as string).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '成员总数',
              dataIndex: 'members',
              render: (members: GroupItem['members']) =>
                Array.isArray(members) ? members.length : 0,
            },
            {
              title: '管理员数量',
              dataIndex: 'members',
              render: (members: GroupItem['members']) =>
                Array.isArray(members)
                  ? members.filter((m) => m.role === 'admin').length
                  : 0,
            },
            {
              title: '创建者',
              dataIndex: 'createdBy',
              render: (createdBy: any) => {
                if (!createdBy) return '-';
                return (
                  <Space>
                    <span>{createdBy.name || createdBy.username}</span>
                    {createdBy.company && (
                      <Tag color="blue">{createdBy.company}</Tag>
                    )}
                  </Space>
                );
              },
            },
            {
              title: '圈子描述',
              dataIndex: 'description',
              span: 2,
            },
          ]}
        />
      </ProCard>

      <ProCard style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="events"
          items={[
            {
              key: 'events',
              label: `活动列表 (${filteredEvents.length})`,
              children: (
                <ProTable<EventItem>
                  dataSource={filteredEvents}
                  loading={eventLoading}
                  rowKey="_id"
                  search={false}
                  pagination={{
                    pageSize: 10,
                  }}
                  columns={[
                    {
                      title: '活动标题',
                      dataIndex: 'title',
                      render: (_, record) => (
                        <a
                          onClick={() => history.push(`/events/${record._id}`)}
                        >
                          {record.title}
                        </a>
                      ),
                    },
                    {
                      title: '活动地点',
                      dataIndex: 'location',
                      ellipsis: true,
                    },
                    {
                      title: '开始时间',
                      dataIndex: 'startTime',
                      render: (text: string) =>
                        dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
                    },
                    {
                      title: '参与人数',
                      render: (_, record) => (
                        <span>
                          {record.participants.length}/{record.maxParticipants}
                        </span>
                      ),
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      render: (status: string) => renderEventStatus(status),
                    },
                    ...(isAdminMode
                      ? [
                          {
                            title: '审核操作',
                            key: 'approval',
                            render: (_: any, record: EventItem) => (
                              <ApprovalActions
                                itemId={record._id}
                                itemType="event"
                                status={record.status}
                                onApprove={handleApproveEvent}
                                onReject={handleRejectEvent}
                                onTakedown={handleTakedownEvent}
                              />
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              ),
            },
            {
              key: 'dynamics',
              label: `动态列表 (${filteredDynamics.length})`,
              children: (
                <ProTable<DynamicItem>
                  dataSource={filteredDynamics}
                  loading={dynamicLoading}
                  rowKey="_id"
                  search={false}
                  pagination={{
                    pageSize: 10,
                  }}
                  columns={[
                    {
                      title: '动态内容',
                      dataIndex: 'content',
                      ellipsis: true,
                      width: 400,
                    },
                    {
                      title: '发布者',
                      dataIndex: ['authorId', 'name'],
                      render: (_, record) => record.authorId?.name || '未知',
                    },
                    {
                      title: '图片',
                      dataIndex: 'images',
                      render: (images: string[]) =>
                        Array.isArray(images) && images.length > 0
                          ? `${images.length}张`
                          : '-',
                    },
                    {
                      title: '点赞数',
                      dataIndex: 'likes',
                    },
                    {
                      title: '评论数',
                      dataIndex: 'comments',
                    },
                    {
                      title: '发布时间',
                      dataIndex: 'createdAt',
                      render: (text: string) =>
                        dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      render: (status: string) => renderStatus(status),
                    },
                    ...(isAdminMode
                      ? [
                          {
                            title: '审核操作',
                            key: 'approval',
                            render: (_: any, record: DynamicItem) => (
                              <ApprovalActions
                                itemId={record._id}
                                itemType="dynamic"
                                status={record.status}
                                onApprove={handleApproveDynamic}
                                onReject={handleRejectDynamic}
                                onTakedown={handleTakedownDynamic}
                              />
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              ),
            },
            {
              key: 'members',
              label: `成员列表 (${memberCount})`,
              children: (
                <ProTable<GroupMemberItem>
                  actionRef={memberActionRef}
                  request={async () => {
                    const result = await getGroupMembers(id!);
                    const data = result.data || [];
                    setMemberCount(data.length);
                    return {
                      data,
                      success: result.code === 200,
                      total: data.length,
                    };
                  }}
                  rowKey="userId"
                  search={false}
                  pagination={{
                    pageSize: 10,
                  }}
                  toolBarRender={() => [
                    <Button
                      key="refresh"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        memberActionRef.current?.reload();
                      }}
                    >
                      刷新
                    </Button>,
                    <Button
                      key="add"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setAddMemberModalVisible(true);
                        fetchUsers();
                      }}
                    >
                      添加成员
                    </Button>,
                  ]}
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
                              公司: {record.user.company} -{' '}
                              {record.user.position}
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
                      render: (text: string) =>
                        dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
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
                              onClick={() => handleApproveMember(record.userId)}
                            >
                              批准
                            </Button>
                          )}
                          <Button
                            type="link"
                            size="small"
                            onClick={() =>
                              handleSetAdmin(record.userId, record.role)
                            }
                          >
                            {record.role === 'admin'
                              ? '取消管理员'
                              : '设为管理员'}
                          </Button>
                          <Popconfirm
                            title="确定要移除这个成员吗？"
                            onConfirm={() => handleRemoveMember(record.userId)}
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
              ),
            },
          ]}
        />
      </ProCard>

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
            options={users.map((user) => ({
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
            }))}
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

export default GroupDetail;
