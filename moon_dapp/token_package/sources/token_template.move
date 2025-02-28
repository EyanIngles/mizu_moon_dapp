
module token::Mizu_coin {
    
    use sui::coin::{Self};


public struct MIZU_COIN has drop {}

fun init(witness: MIZU_COIN, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        witness,
        9,
        b"MZCN",
        b"Mizu_coin",
        b"This is a coin that is generated to be renamed and description must be changed, if this description has not been changed, do not trade...",
        option::none(),
        ctx,
    );

    transfer::public_transfer(metadata, ctx.sender()); // will want to send these to an objectId so that the object can utilise these 
    transfer::public_transfer(treasury, ctx.sender());
}

}