import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './components/Button/index.css';
import { H2, H4, Text } from './components/Typography';
import { ItemCard, ActionButton } from './components/Card';
import { RewardsActionButton } from './components/Button/RewardsActionButton';
import { tokens } from './styles/tokens';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IosShareIcon from '@mui/icons-material/IosShare';
import { RewardCard } from './components/Card/RewardCard';
import { OrderInfoCardCarousel } from './components/Card/OrderInfoCardCarousel';

const rewards = {
  points: 10,
  sales: 8,
  unlocked: true,
  progress: 1,
};

const rewardCards = [
  {
    title: '25% discount on any ticket',
    points: 500,
    progress: 500,
    totalPoints: 500,
    isUnlocked: true,
  },
  {
    title: 'Get a free hat',
    points: 500,
    progress: 400,
    totalPoints: 500,
    isUnlocked: false,
  },
  {
    title: '75% Off',
    points: 20,
    progress: 10,
    totalPoints: 20,
    isUnlocked: false,
  },
];

interface Order {
  date: string;
  time: string;
  orderId: string;
  count: number;
}

interface Item {
  image: string;
  name: string;
  section: string;
  row: string;
  seat: string;
}

// Mock Data
const orders: Order[] = [
  {
    date: 'Aug 14, 2025',
    time: '2:32pm EST',
    orderId: 'PKF94KFY',
    count: 3,
  },
  {
    date: 'Aug 13, 2025',
    time: '1:15pm EST',
    orderId: 'ABC123DE',
    count: 2,
  },
  {
    date: 'Aug 12, 2025',
    time: '11:45am EST',
    orderId: 'XYZ789FG',
    count: 1,
  },
];

const items: Item[] = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    name: 'Super long name game',
    section: 'Sec 12',
    row: 'Row 3',
    seat: 'Seat 1',
  },
  {
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    name: 'Another Game',
    section: 'Sec 29',
    row: 'Row 9',
    seat: 'Seat 8',
  },
];

const App: React.FC = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App" style={{ paddingBottom: 80 }}>
              {/* Header with background */}
              <header
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=3540&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: tokens.spacing.space3,
                }}
              >
                {/* Dark gradient overlay for better text visibility */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 70%, #111111 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Content blur overlay - only behind text */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(17,17,17,0.4)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1,
                  }}
                />

                {/* Navigation bar */}
                <nav
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: `${tokens.spacing.space2} ${tokens.spacing.space2}`,
                  }}
                >
                  <button
                    style={{
                      background: '#111111',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.history.back()}
                  >
                    <ArrowBackIcon sx={{ fill: '#FFFFFF' }} />
                  </button>

                  <div style={{ flex: 1 }} />

                  <div
                    style={{
                      display: 'flex',
                      gap: tokens.spacing.space2,
                      alignItems: 'center',
                    }}
                  >
                    <button
                      style={{
                        background: '#111111',
                        border: 'none',
                        borderRadius: '24px',
                        padding: `${tokens.spacing.space1} ${tokens.spacing.space3}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        height: '40px',
                      }}
                    >
                      <Text
                        variant="small"
                        weight="bold"
                        style={{ color: '#FFFFFF' }}
                      >
                        View Order
                      </Text>
                    </button>

                    <button
                      style={{
                        background: '#111111',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <IosShareIcon sx={{ fill: '#FFFFFF' }} />
                    </button>
                  </div>
                </nav>

                {/* Header content */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: tokens.spacing.space2,
                    marginTop: '120px',
                    textAlign: 'center',
                  }}
                >
                  <H4
                    style={{
                      color: tokens.colors.textPrimary,
                      marginBottom: tokens.spacing.space2,
                      fontSize: '28px',
                      fontWeight: 'bold',
                    }}
                  >
                    New York Red Bulls VS Inter Miami
                  </H4>
                  <Text
                    variant="regular"
                    color="primary"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      fontSize: '20px',
                      marginBottom: tokens.spacing.space1,
                    }}
                  >
                    Red Bull Arena
                  </Text>
                  <Text
                    variant="regular"
                    color="primary"
                    style={{ display: 'block', textAlign: 'center' }}
                  >
                    Jan 15, 2023 at 8:00PM PST
                  </Text>
                </div>
              </header>

              {/* Orders Section */}
              <section
                className="content-container"
                style={{ marginBottom: tokens.spacing.space2 }}
              >
                <div
                  style={{
                    background: tokens.colors.cardBackground,
                    borderRadius: tokens.borderRadius.large,
                    padding: `${tokens.spacing.space3} ${tokens.spacing.space2} ${tokens.spacing.space2} ${tokens.spacing.space2}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing.space2,
                  }}
                >
                  {/* Your Orders */}
                  <div>
                    <Text
                      variant="regular"
                      weight="bold"
                      style={{ marginBottom: tokens.spacing.space2 }}
                    >
                      Your Orders
                    </Text>
                    <OrderInfoCardCarousel orders={orders} />
                  </div>

                  {/* Your Items */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: tokens.spacing.space2,
                      }}
                    >
                      <Text variant="regular" weight="bold">
                        Your Items
                      </Text>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: tokens.spacing.space1,
                        }}
                      >
                        <Text variant="regular" weight="bold">
                          11
                        </Text>
                        <ChevronRightIcon
                          sx={{ width: 24, height: 24, fill: 'white' }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        marginRight: '-16px',
                        width: 'calc(100% + 16px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'nowrap',
                          overflowX: 'auto',
                          gap: tokens.spacing.space1,
                          width: '100%',
                          scrollbarWidth: 'none',
                          paddingBottom: tokens.spacing.space2,
                        }}
                      >
                        {items.map((item, index) => (
                          <ItemCard key={`${item.name}-${index}`}>
                            <div className="image-container">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="content">
                              <Text
                                variant="regular"
                                weight="bold"
                                className="truncate"
                              >
                                {item.name}
                              </Text>
                              <Text variant="tiny">
                                {item.section}, {item.row}, {item.seat}
                              </Text>
                            </div>
                          </ItemCard>
                        ))}
                        <div
                          style={{ minWidth: '8px', flex: '0 0 8px' }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: tokens.spacing.space3,
                      width: '100%',
                    }}
                  >
                    <ActionButton
                      icon={
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
                            fill="white"
                          />
                        </svg>
                      }
                      header="Sell"
                      description="Sell tickets at your own price"
                    />
                    <ActionButton
                      icon={
                        <OpenInNewIcon
                          sx={{ width: 32, height: 32, fill: 'white' }}
                        />
                      }
                      header="Transfers"
                      description="Send tickets & items to anyone"
                    />
                    <ActionButton
                      icon={
                        <ArrowCircleUpIcon
                          sx={{ width: 32, height: 32, fill: 'white' }}
                        />
                      }
                      header="Upgrade"
                      description="Available upgrade offers"
                    />
                  </div>
                </div>
              </section>

              {/* Resale Section */}
              <section
                className="content-container"
                style={{ marginBottom: tokens.spacing.space2 }}
              >
                <div
                  style={{
                    background: tokens.colors.cardBackground,
                    borderRadius: tokens.borderRadius.large,
                    padding: `${tokens.spacing.space3} ${tokens.spacing.space2} ${tokens.spacing.space2} ${tokens.spacing.space2}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing.space2,
                  }}
                >
                  <Text
                    variant="regular"
                    weight="bold"
                    style={{ color: 'white' }}
                  >
                    Resale
                  </Text>

                  <ActionButton
                    icon={
                      <StorefrontIcon
                        sx={{ width: 32, height: 32, fill: 'white' }}
                      />
                    }
                    header="Your listings"
                    description="Manage your listings"
                    rightIcon={
                      <ChevronRightIcon
                        sx={{
                          width: 24,
                          height: 24,
                          fill: 'white',
                          opacity: 0.7,
                        }}
                      />
                    }
                    onClick={() => console.log('Your listings clicked')}
                  />
                </div>
              </section>

              {/* Rewards Section */}
              <section className="content-container">
                <div
                  style={{
                    background: tokens.colors.cardBackground,
                    borderRadius: tokens.borderRadius.large,
                    padding: `${tokens.spacing.space3} ${tokens.spacing.space2} ${tokens.spacing.space2} ${tokens.spacing.space2}`,
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacing.space2,
                  }}
                >
                  <Text
                    variant="regular"
                    weight="bold"
                    style={{ color: 'white' }}
                  >
                    Rewards
                  </Text>

                  {/* Points and Sales */}
                  <div>
                    <H2
                      style={{
                        background: 'var(--gradient-rewards)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: tokens.spacing.space2,
                        fontSize: 'var(--font-size-h2)',
                        lineHeight: 'var(--line-height-h2)',
                        fontWeight: 'bold',
                      }}
                    >
                      {rewards.points} points
                    </H2>
                    <H2
                      style={{
                        color: 'white',
                        fontSize: 'var(--font-size-h2)',
                        lineHeight: 'var(--line-height-h2)',
                        fontWeight: 'bold',
                      }}
                    >
                      {rewards.sales} sales
                    </H2>
                  </div>

                  {/* Rewards Carousel */}
                  <div
                    style={{
                      marginRight: '-16px',
                      width: 'calc(100% + 16px)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        gap: '8px',
                        width: '100%',
                        scrollbarWidth: 'none',
                        paddingBottom: tokens.spacing.space2,
                      }}
                    >
                      {rewardCards.map((card, index) => (
                        <React.Fragment key={index}>
                          <RewardCard
                            title={card.title}
                            points={card.points}
                            progress={card.progress}
                            totalPoints={card.totalPoints}
                            isUnlocked={card.isUnlocked}
                          />
                          {index < rewardCards.length - 1 && (
                            <div
                              style={{
                                width: '8px',
                                height: '1px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                alignSelf: 'center',
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                      <div
                        style={{ minWidth: '8px', flex: '0 0 8px' }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Carousel Navigation */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: tokens.spacing.space2,
                      marginTop: '24px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="action-buttons"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: tokens.spacing.space2,
                    }}
                  >
                    <RewardsActionButton
                      label="Points"
                      onClick={() => console.log('Points clicked')}
                    />
                    <RewardsActionButton
                      label="Points per Ticket"
                      onClick={() => console.log('Points per Ticket clicked')}
                    />
                    <RewardsActionButton
                      label="Leaderboard"
                      onClick={() => console.log('Leaderboard clicked')}
                    />
                    <RewardsActionButton
                      label="FAQs"
                      onClick={() => console.log('FAQs clicked')}
                    />
                    <RewardsActionButton
                      variant="gradient"
                      label="Share link with friends"
                      icon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                            fill={tokens.colors.textPrimary}
                          />
                        </svg>
                      }
                      onClick={() => console.log('Share Link clicked')}
                    />
                  </div>
                </div>
              </section>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
