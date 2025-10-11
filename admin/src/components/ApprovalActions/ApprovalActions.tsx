import { CheckOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import React from 'react';

interface ApprovalActionsProps {
  itemId: string;
  itemType: 'event' | 'dynamic';
  status: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onTakedown?: (id: string) => Promise<void>;
  onSuccess?: () => void;
}

const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  itemId,
  itemType,
  status,
  onApprove,
  onReject,
  onTakedown,
  onSuccess,
}) => {
  const itemTypeText = itemType === 'event' ? '活动' : '动态';

  const handleApprove = async () => {
    try {
      await onApprove(itemId);
      message.success(`${itemTypeText}审核通过`);
      onSuccess?.();
    } catch (error) {
      message.error(`${itemTypeText}审核失败`);
    }
  };

  const handleReject = async () => {
    try {
      await onReject(itemId);
      message.success(`${itemTypeText}已拒绝`);
      onSuccess?.();
    } catch (error) {
      message.error(`操作失败`);
    }
  };

  const handleTakedown = async () => {
    try {
      await onTakedown?.(itemId);
      message.success(`${itemTypeText}已撤销`);
      onSuccess?.();
    } catch (error) {
      message.error(`撤销失败`);
    }
  };

  if (status === 'approved') {
    return (
      <Space>
        <span style={{ color: '#52c41a' }}>已通过</span>
        {onTakedown && (
          <Popconfirm
            title={`确定撤销此${itemTypeText}吗？`}
            description="撤销后将不再对外展示"
            onConfirm={handleTakedown}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size="small" icon={<StopOutlined />}>
              撤销
            </Button>
          </Popconfirm>
        )}
      </Space>
    );
  }

  if (status === 'rejected') {
    return (
      <Space>
        <span style={{ color: '#ff4d4f' }}>已拒绝</span>
        {onTakedown && (
          <Popconfirm
            title={`确定通过此${itemTypeText}吗？`}
            description="通过后将对外展示"
            onConfirm={handleApprove}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" size="small" icon={<CheckOutlined />}>
              通过
            </Button>
          </Popconfirm>
        )}
      </Space>
    );
  }

  return (
    <Space>
      <Popconfirm
        title={`确定通过此${itemTypeText}吗？`}
        onConfirm={handleApprove}
        okText="确定"
        cancelText="取消"
      >
        <Button type="primary" size="small" icon={<CheckOutlined />}>
          通过
        </Button>
      </Popconfirm>
      <Popconfirm
        title={`确定拒绝此${itemTypeText}吗？`}
        onConfirm={handleReject}
        okText="确定"
        cancelText="取消"
      >
        <Button danger size="small" icon={<CloseOutlined />}>
          拒绝
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default ApprovalActions;
