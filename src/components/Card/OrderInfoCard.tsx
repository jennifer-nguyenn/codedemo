import React from 'react';
import styled from 'styled-components';
import { Text } from '../Typography';
import { tokens } from '../../styles/tokens';

interface OrderInfoCardProps {
  date: string;
  time: string;
  orderId: string;
  count: number;
}

const CardContainer = styled.div`
  background: ${tokens.colors.orderCard};
  border-radius: ${tokens.borderRadius.large};
  padding: ${tokens.spacing.space3};
  width: ${tokens.components.orderInfoCard.mobileWidth};
  min-width: ${tokens.components.orderInfoCard.mobileWidth};
  flex: 0 0 ${tokens.components.orderInfoCard.mobileWidth};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const CountBadge = styled.div`
  position: absolute;
  top: ${tokens.spacing.space3};
  right: ${tokens.spacing.space3};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${tokens.colors.orderCountBg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.darkTextPrimary};
  font-weight: ${tokens.typography.weights.bold};
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.space1};
  margin-bottom: ${tokens.spacing.space2};
`;

const ViewOrderLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
  color: ${tokens.colors.darkTextPrimary};
`;

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
  date,
  time,
  orderId,
  count,
}) => {
  return (
    <CardContainer>
      <TextGroup>
        <Text
          variant="small"
          weight="bold"
          style={{ color: tokens.colors.darkTextPrimary }}
        >
          {date}
        </Text>
        <Text variant="tiny" style={{ color: tokens.colors.darkTextSecondary }}>
          {time}
        </Text>
        <Text variant="tiny" style={{ color: tokens.colors.darkTextSecondary }}>
          Order ID: {orderId}
        </Text>
      </TextGroup>
      <CountBadge>{count}</CountBadge>
      <ViewOrderLink variant="small" weight="bold">
        View Order
      </ViewOrderLink>
    </CardContainer>
  );
};
