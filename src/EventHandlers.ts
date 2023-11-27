import {
  LaunchBridgeContract_ETHDeposited_loader,
  LaunchBridgeContract_ETHDeposited_handler,
  LaunchBridgeContract_USDDeposited_loader,
  LaunchBridgeContract_USDDeposited_handler,
  ChainlinkOracleContract_AnswerUpdated_loader,
  ChainlinkOracleContract_AnswerUpdated_handler,
} from "../generated/src/Handlers.gen";

import {
  ETHDepositedEntity,
  USDDepositedEntity,
  EventsSummaryEntity,
  UserEntity,
} from "./src/Types.gen";

const BASE_18 = BigInt(1000000000000000000);
const BASE_8 = BigInt(100000000);

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  eTHDepositedsCount: BigInt(0),
  uSDDepositedsCount: BigInt(0),
  totalNumberOfUsers: BigInt(0),
  totalETHDeposited: BigInt(0),
  totalDAIDeposited: BigInt(0),
  latestETHPrice: BigInt(0),
  totalDepositedUSD: BigInt(0),
  totalETHDepositedUSD: BigInt(0),
};

const INITIAL_USER: UserEntity = {
  id: "0x0000000",
  totalNumberOfDeposits: BigInt(0),
  numberOfETHDeposits: BigInt(0),
  numberOfUSDDeposits: BigInt(0),
  totalDepositedUSD: BigInt(0),
};

ChainlinkOracleContract_AnswerUpdated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ChainlinkOracleContract_AnswerUpdated_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    latestETHPrice: event.params.current,
  };

  context.EventsSummary.set(nextSummaryEntity);
});

LaunchBridgeContract_ETHDeposited_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.User.load(event.params.user.toString());
});

LaunchBridgeContract_ETHDeposited_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
  let user = context.User.get(event.params.user.toString());

  let currentUserEntity: UserEntity = user ?? INITIAL_USER;
  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let currentETHPrice = currentSummaryEntity.latestETHPrice / BASE_8;
  let newTotalETHDeposited =
    currentSummaryEntity.totalETHDeposited + event.params.amount;
  let newTotalETHDepositedUSD =
    (currentETHPrice * newTotalETHDeposited) / BASE_18;

  let nextUserEntity = {
    ...currentUserEntity,
    id: event.params.user.toString(),
    totalNumberOfDeposits: currentUserEntity.totalNumberOfDeposits + BigInt(1),
    numberOfETHDeposits: currentUserEntity.numberOfETHDeposits + BigInt(1),
    totalDepositedUSD:
      currentUserEntity.totalDepositedUSD +
      currentETHPrice * (event.params.amount / BASE_18),
  };

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    eTHDepositedsCount: currentSummaryEntity.eTHDepositedsCount + BigInt(1),
    totalNumberOfUsers:
      user == null
        ? currentSummaryEntity.totalNumberOfUsers + BigInt(1)
        : currentSummaryEntity.totalNumberOfUsers,

    totalETHDeposited: newTotalETHDeposited,
    totalETHDepositedUSD: newTotalETHDepositedUSD,
    totalDepositedUSD:
      newTotalETHDepositedUSD +
      currentSummaryEntity.totalDAIDeposited / BASE_18,
  };

  let eTHDepositedEntity: ETHDepositedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    user: event.params.user,
    shares: event.params.shares,
    amount: event.params.amount,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    timestamp: event.blockTimestamp,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ETHDeposited.set(eTHDepositedEntity);
  context.User.set(nextUserEntity);
});

LaunchBridgeContract_USDDeposited_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.User.load(event.params.user.toString());
});

LaunchBridgeContract_USDDeposited_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
  let user = context.User.get(event.params.user.toString());

  let currentUserEntity: UserEntity = user ?? INITIAL_USER;
  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let currentETHPrice = currentSummaryEntity.latestETHPrice / BASE_8;
  let newTotalETHDepositedUSD =
    (currentETHPrice * currentSummaryEntity.totalETHDeposited) / BASE_18;

  let nextUserEntity = {
    ...currentUserEntity,
    id: event.params.user.toString(),
    totalNumberOfDeposits: currentUserEntity.totalNumberOfDeposits + BigInt(1),
    numberOfUSDDeposits: currentUserEntity.numberOfUSDDeposits + BigInt(1),
    totalDepositedUSD:
      currentUserEntity.totalDepositedUSD + event.params.daiAmount / BASE_18,
  };

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    uSDDepositedsCount: currentSummaryEntity.uSDDepositedsCount + BigInt(1),
    totalNumberOfUsers:
      user == null
        ? currentSummaryEntity.totalNumberOfUsers + BigInt(1)
        : currentSummaryEntity.totalNumberOfUsers,

    totalDAIDeposited:
      currentSummaryEntity.totalDAIDeposited + event.params.daiAmount,
    totalETHDepositedUSD: newTotalETHDepositedUSD,
    totalDepositedUSD:
      newTotalETHDepositedUSD +
      (currentSummaryEntity.totalDAIDeposited + event.params.daiAmount) /
        BASE_18,
  };

  let uSDDepositedEntity: USDDepositedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    user: event.params.user,
    shares: event.params.shares,
    amount: event.params.amount,
    daiAmount: event.params.daiAmount,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    timestamp: event.blockTimestamp,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.USDDeposited.set(uSDDepositedEntity);
  context.User.set(nextUserEntity);
});
