#[allow(unused_use)]
module moon_package::create_token {
    
    // create coins and LP with the value of sui passed through, always allow 1% of the inital tokens to be supplied to the creator.?
    use sui::coin::{Self, TreasuryCap};
    use sui::balance::{Balance};
    use std::ascii::{Self, String};
    use std::string;
    use sui::table;
    use sui::url;
    use sui::sui::{SUI};

    const CONTRACT_HASNT_BEEN_PUBLISHED_OR_WRONG_CHECKER_USED: u64 = 1;
    const NOT_ENOUGH_SUI_TO_PERFORM_TRANSACTION: u64 = 2;

    #[allow(missing_phantom)] // not sure if this effects the usage or not yet.
    public struct LP<T: store, SUI: store> has key, store {
        id: UID,
        creator: address,
        coin_a_name: String,
        coin_b_name: String, //default will be sui.
        coin_a_balance: Balance<T>,
        coin_b_balance: Balance<SUI>,
        current_holders: u64,
        burn_coins: bool,
        burn_amount_each_transaction: u64,
        index: u64,
    }
    public struct Coin_tracker<T: store,SUI: store> has key, store {
        id: UID,
        coin_LP: table::Table<u64, LP<T, SUI>>,
        next_index: u64
    }
    public struct Init_checker has key, store {
        id: UID,
        is_created: bool
    }
    public struct T has drop {}

    fun init(ctx: &mut TxContext) {
        let init_checker = Init_checker {
            id: object::new(ctx),
            is_created: true
        };
        transfer::public_share_object(init_checker)
    }
    
    
    #[allow(unused_function)]
    fun create_pool<T: store, SUI: store>(tracker: &mut Coin_tracker<T,SUI>, coin_a_balance: Balance<T>, 
    coin_b_balance: Balance<SUI>, coin_a_name: String, coin_b_name: String, ctx: &mut TxContext):LP<T,SUI>{
        
        let creator = tx_context::sender(ctx);
        let index = tracker.next_index;
        let pool = LP<T,SUI> {
            id: object::new(ctx),
            creator,
            coin_a_name, 
            coin_b_name,
            coin_a_balance,
            coin_b_balance ,
            current_holders: 0,
            burn_coins: false,
            burn_amount_each_transaction: 0,
            index, // this needs to be under the next index. be the same same.
        };
        tracker.next_index = index + 1;
        pool
    }

    #[allow(unused_variable, lint(self_transfer))]
    
    // this should be non public.
    public fun mint_coin_then_freeze<T>(cap: &mut TreasuryCap<T>, value: u64, ctx: &mut TxContext): coin::Coin<T> {
        let coin = coin::mint( cap, value, ctx);
        coin
    }
    #[allow(unused_function)]
    fun burn_token_each_transaction<T>(cap: &mut TreasuryCap<T>, coin: coin::Coin<T>) {
        coin::burn(cap, coin);
    }
    // create pool
    // create tokens
    // add liquidity
    // 
}



