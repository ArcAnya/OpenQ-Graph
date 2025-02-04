import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { NFTDepositReceived } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleNftDepositReceived } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleNftDepositReceived', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new nft deposit received', () => {
		let newNftDepositReceivedEvent = createNewNftDepositReceivedEvent(
			Constants.depositId,
			Constants.id,
			Constants.bountyId,
			Constants.organization,
			Constants.tokenAddress,
			Constants.receiveTime,
			Constants.userId,
			Constants.expiration,
			Constants.tokenId,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version
		)

		newNftDepositReceivedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newNftDepositReceivedEvent.transaction.from = Address.fromString(Constants.userId)

		handleNftDepositReceived(newNftDepositReceivedEvent)

		assert.fieldEquals('Deposit', Constants.depositId, 'id', Constants.depositId)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'sender', Constants.userId)
		assert.fieldEquals('Deposit', Constants.depositId, 'bounty', Constants.id)
		assert.fieldEquals('Deposit', Constants.depositId, 'receiveTime', Constants.receiveTime)
		assert.fieldEquals('Deposit', Constants.depositId, 'organization', Constants.organization)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenEvents', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'refunded', 'false')
		assert.fieldEquals('Deposit', Constants.depositId, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenId', '1')
		assert.fieldEquals('Deposit', Constants.depositId, 'expiration', Constants.expiration)
		assert.fieldEquals('Deposit', Constants.depositId, 'isNft', 'true')
	})
})

export function createNewNftDepositReceivedEvent(
	depositId: string,
	bountyAddress: string,
	bountyId: string,
	organization: string,
	tokenAddress: string,
	receiveTime: string,
	sender: string,
	expiration: string,
	tokenId: string,
	bountyType: string,
	data: string,
	version: string
): NFTDepositReceived {
	let newNftDepositReceivedEvent = changetype<NFTDepositReceived>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("depositId", ethereum.Value.fromBytes(Bytes.fromHexString(depositId))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("tokenAddress", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
		new ethereum.EventParam("receiveTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(receiveTime))),
		new ethereum.EventParam("sender", ethereum.Value.fromAddress(Address.fromString(sender))),
		new ethereum.EventParam("expiration", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(expiration))),
		new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newNftDepositReceivedEvent.parameters = parameters;

	return newNftDepositReceivedEvent
}