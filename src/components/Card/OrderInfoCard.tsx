import React from 'react';
import styled from 'styled-components';
import { Text } from '../Typography';
import { tokens } from '../../styles/tokens';

export interface OrderInfoCardFeatures {
  showTime?: boolean;
  showPaymentBadge?: boolean;
  showManagePaymentPlan?: boolean;
}

interface OrderInfoCardProps {
  date: string;
  time: string;
  orderId: string;
  count: number;
  features?: OrderInfoCardFeatures;
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
  box-sizing: border-box;

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

const BadgeRow = styled.div`
  min-height: 24px;
  height: 24px;
  margin-bottom: ${tokens.spacing.space2};
  display: flex;
  align-items: flex-start;
`;

const PaymentBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: #111111;
  color: #fff;
  border-radius: 1000px;
  padding: 2px 10px;
  font-size: ${tokens.typography.sizes.tiny};
  font-weight: ${tokens.typography.weights.bold};
  height: 24px;
  line-height: 1;
  width: fit-content;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.space1};
  margin-bottom: ${tokens.spacing.space2};
`;

const LinksRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${tokens.spacing.space2};
  margin-top: auto;
`;

const StyledLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
  color: ${tokens.colors.darkTextPrimary};
`;

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
  date,
  time,
  orderId,
  count,
  features = {},
}) => {
  const {
    showTime = false,
    showPaymentBadge = false,
    showManagePaymentPlan = false,
  } = features;

  return (
    <CardContainer>
      <BadgeRow>
        {showPaymentBadge ? <PaymentBadge>Payment Plan</PaymentBadge> : null}
      </BadgeRow>
      <TextGroup>
        <Text
          variant="small"
          weight="bold"
          style={{ color: tokens.colors.darkTextPrimary }}
        >
          {date}
        </Text>
        {showTime && (
          <Text
            variant="tiny"
            style={{ color: tokens.colors.darkTextSecondary }}
          >
            {time}
          </Text>
        )}
        <Text variant="tiny" style={{ color: tokens.colors.darkTextSecondary }}>
          Order ID: {orderId}
        </Text>
      </TextGroup>
      <CountBadge>{count}</CountBadge>
      <LinksRow>
        <StyledLink
          as={showManagePaymentPlan ? StyledLink : Text}
          variant="small"
          weight="bold"
          style={{ visibility: 'visible' }}
        >
          View Order
        </StyledLink>
        {showManagePaymentPlan && (
          <StyledLink variant="small" weight="bold">
            Manage Payment Plan
          </StyledLink>
        )}
      </LinksRow>
    </CardContainer>
  );
};
