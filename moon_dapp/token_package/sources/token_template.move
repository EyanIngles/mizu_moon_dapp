
module token::aa {
    
    use sui::coin::{Self};


public struct AA has drop {}

fun init(witness: AA, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        witness,
        9,
        b"AA",
        b"aa",
        b"",
        option::none(),
        ctx,
    );

    transfer::public_transfer(metadata, ctx.sender());
    transfer::public_transfer(treasury, ctx.sender());
}

}