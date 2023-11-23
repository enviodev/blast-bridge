/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  LaunchBridgeContract_AdminChanged_loader,
  LaunchBridgeContract_AdminChanged_handler,
  LaunchBridgeContract_BeaconUpgraded_loader,
  LaunchBridgeContract_BeaconUpgraded_handler,
  LaunchBridgeContract_ETHDeposited_loader,
  LaunchBridgeContract_ETHDeposited_handler,
  LaunchBridgeContract_Initialized_loader,
  LaunchBridgeContract_Initialized_handler,
  LaunchBridgeContract_OwnershipTransferStarted_loader,
  LaunchBridgeContract_OwnershipTransferStarted_handler,
  LaunchBridgeContract_OwnershipTransferred_loader,
  LaunchBridgeContract_OwnershipTransferred_handler,
  LaunchBridgeContract_Paused_loader,
  LaunchBridgeContract_Paused_handler,
  LaunchBridgeContract_USDDeposited_loader,
  LaunchBridgeContract_USDDeposited_handler,
  LaunchBridgeContract_Unpaused_loader,
  LaunchBridgeContract_Unpaused_handler,
  LaunchBridgeContract_Upgraded_loader,
  LaunchBridgeContract_Upgraded_handler,
} from "../generated/src/Handlers.gen";

import {
  AdminChangedEntity,
  BeaconUpgradedEntity,
  ETHDepositedEntity,
  InitializedEntity,
  OwnershipTransferStartedEntity,
  OwnershipTransferredEntity,
  PausedEntity,
  USDDepositedEntity,
  UnpausedEntity,
  UpgradedEntity,
  EventsSummaryEntity,
  UserEntity,
} from "./src/Types.gen";

const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  adminChangedsCount: BigInt(0),
  beaconUpgradedsCount: BigInt(0),
  eTHDepositedsCount: BigInt(0),
  initializedsCount: BigInt(0),
  ownershipTransferStartedsCount: BigInt(0),
  ownershipTransferredsCount: BigInt(0),
  pausedsCount: BigInt(0),
  uSDDepositedsCount: BigInt(0),
  unpausedsCount: BigInt(0),
  upgradedsCount: BigInt(0),
};

const INITIAL_USER: UserEntity = {
  id: "0x000000",
  totalNumberOfDeposits: BigInt(0),
  numberOfETHDeposits: BigInt(0),
  numberOfUSDDeposits: BigInt(0),
};

LaunchBridgeContract_ETHDeposited_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.User.load(event.params.user.toString());
});

LaunchBridgeContract_ETHDeposited_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
  let user = context.User.get(event.params.user.toString());

  let currentUserEntity: UserEntity = user ?? INITIAL_USER;

  let nextUserEntity = {
    ...currentUserEntity,
    id: event.params.user.toString(),
    totalNumberOfDeposits: currentUserEntity.totalNumberOfDeposits + BigInt(1),
    numberOfETHDeposits: currentUserEntity.numberOfETHDeposits + BigInt(1),
  };

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    eTHDepositedsCount: currentSummaryEntity.eTHDepositedsCount + BigInt(1),
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

  let nextUserEntity = {
    ...currentUserEntity,
    id: event.params.user.toString(),
    totalNumberOfDeposits: currentUserEntity.totalNumberOfDeposits + BigInt(1),
    numberOfUSDDeposits: currentUserEntity.numberOfUSDDeposits + BigInt(1),
  };

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    uSDDepositedsCount: currentSummaryEntity.uSDDepositedsCount + BigInt(1),
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

LaunchBridgeContract_AdminChanged_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_AdminChanged_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    adminChangedsCount: currentSummaryEntity.adminChangedsCount + BigInt(1),
  };

  let adminChangedEntity: AdminChangedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    previousAdmin: event.params.previousAdmin,
    newAdmin: event.params.newAdmin,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.AdminChanged.set(adminChangedEntity);
});

LaunchBridgeContract_BeaconUpgraded_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_BeaconUpgraded_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    beaconUpgradedsCount: currentSummaryEntity.beaconUpgradedsCount + BigInt(1),
  };

  let beaconUpgradedEntity: BeaconUpgradedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    beacon: event.params.beacon,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.BeaconUpgraded.set(beaconUpgradedEntity);
});

LaunchBridgeContract_Initialized_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_Initialized_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    initializedsCount: currentSummaryEntity.initializedsCount + BigInt(1),
  };

  let initializedEntity: InitializedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    version: event.params.version,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Initialized.set(initializedEntity);
});

LaunchBridgeContract_OwnershipTransferStarted_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_OwnershipTransferStarted_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    ownershipTransferStartedsCount:
      currentSummaryEntity.ownershipTransferStartedsCount + BigInt(1),
  };

  let ownershipTransferStartedEntity: OwnershipTransferStartedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.OwnershipTransferStarted.set(ownershipTransferStartedEntity);
});

LaunchBridgeContract_OwnershipTransferred_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_OwnershipTransferred_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    ownershipTransferredsCount:
      currentSummaryEntity.ownershipTransferredsCount + BigInt(1),
  };

  let ownershipTransferredEntity: OwnershipTransferredEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.OwnershipTransferred.set(ownershipTransferredEntity);
});

LaunchBridgeContract_Paused_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_Paused_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    pausedsCount: currentSummaryEntity.pausedsCount + BigInt(1),
  };

  let pausedEntity: PausedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    account: event.params.account,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Paused.set(pausedEntity);
});

LaunchBridgeContract_Unpaused_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_Unpaused_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    unpausedsCount: currentSummaryEntity.unpausedsCount + BigInt(1),
  };

  let unpausedEntity: UnpausedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    account: event.params.account,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Unpaused.set(unpausedEntity);
});

LaunchBridgeContract_Upgraded_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

LaunchBridgeContract_Upgraded_handler(({ event, context }) => {
  let summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  let currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  let nextSummaryEntity = {
    ...currentSummaryEntity,
    upgradedsCount: currentSummaryEntity.upgradedsCount + BigInt(1),
  };

  let upgradedEntity: UpgradedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    implementation: event.params.implementation,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Upgraded.set(upgradedEntity);
});
