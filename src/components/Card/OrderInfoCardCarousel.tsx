import React from 'react';
import styled from 'styled-components';
import { OrderInfoCard } from './OrderInfoCard';
import { tokens, orderInfoCardFeatures } from '../../styles/tokens';

interface OrderInfoCardCarouselProps {
  orders: Array<{
    date: string;
    time: string;
    orderId: string;
    count: number;
  }>;
}

const OuterWrapper = styled.div`
  margin-right: -16px;
  width: calc(100% + 16px);
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.space1};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: ${tokens.spacing.space2};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 ${tokens.components.orderInfoCard.mobileWidth};
  min-width: ${tokens.components.orderInfoCard.mobileWidth};
`;

export const OrderInfoCardCarousel: React.FC<OrderInfoCardCarouselProps> = ({ orders }) => {
  return (
    <OuterWrapper>
      <CarouselContainer>
        {orders.map((order, idx) => (
          <CardWrapper key={order.orderId}>
            <OrderInfoCard
              date={order.date}
              time={order.time}
              orderId={order.orderId}
              count={order.count}
              features={orderInfoCardFeatures}
            />
          </CardWrapper>
        ))}
        {/* Trailing spacer for right margin */}
        <div style={{ minWidth: '8px', flex: '0 0 8px' }} aria-hidden="true" />
      </CarouselContainer>
    </OuterWrapper>
  );
}; 