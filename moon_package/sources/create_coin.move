
#[allow(unused_use)]
module moon_package::REGCOIN {
    
    use sui::coin::{Self, TreasuryCap};
    use sui::balance::{Balance};
    use std::ascii::{Self, String};
    use std::string;
    use sui::table;
    use sui::url;
    use sui::sui::{SUI};

    use sui::{coin::{DenyCapV2}, deny_list::DenyList};

public struct REGCOIN has drop {}

fun init(witness: REGCOIN, ctx: &mut TxContext) {
    let (treasury, deny_cap, metadata) = coin::create_regulated_currency_v2(
        witness,
        6,
        b"REGCOIN",
        b"",
        b"",
        option::none(),
        false,
        ctx,
    );
    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_transfer(deny_cap, ctx.sender())
}

}