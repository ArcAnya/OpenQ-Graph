import { BigInt, store } from "@graphprotocol/graph-ts"
import { NFTClaimed } from "../../generated/OpenQ/OpenQ"
import {
	TokenEvents,
	Payout,
	User,
	UserPayoutTokenBalance,
	OrganizationPayoutTokenBalance,
	OrganizationFundedTokenBalance,
	PayoutTokenBalance
} from "../../generated/schema"

export default function handleNftClaimed(event: NFTClaimed): void {
	let bountyPayoutId = `${event.params.closer.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let payout = new Payout(bountyPayoutId)

	payout.tokenAddress = event.params.tokenAddress
	payout.bounty = event.params.bountyAddress.toHexString()
	payout.payoutTime = event.params.payoutTime
	payout.isNft = true
	payout.tokenId = event.params.tokenId
	payout.organization = event.params.organization
	payout.transactionHash = event.transaction.hash;

	// UPSERT USER
	let user = User.load(event.params.closer.toHexString())

	if (!user) {
		user = new User(event.params.closer.toHexString())
		user.save()
	}

	payout.closer = user.id

	// SAVE ALL ENTITIES
	payout.save()
}