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
    #[allow(unused_variable, lint(self_transfer, share_owned))]
    public fun create_coin_practise(name: String, decimals: u8, amount_of_tokens: u64, symbol: String, description: string::String, ctx: &mut TxContext) {
        let witness = create_witness();
        let name = name.into_bytes();
        let symbol = symbol.into_bytes();
        let description = description.into_bytes();

        let (treasury, metadata) = coin::create_currency<T>(witness,
         decimals, symbol, name, description, option::none(), ctx);
        transfer::public_share_object(treasury);
        transfer::public_share_object(metadata);
        }

    public fun create_new_token<T: store,SUI: store>(/*tracker: &mut Coin_tracker<T, SUI>,*/init_checker: &Init_checker, sui_coin: &mut coin::Coin<SUI>, coin_b_pair_is_SUI: bool, name: String, decimals: u8, amount_of_tokens: u64, symbol: String, description: string::String, icon_url:Option<url::Url>, ctx: &mut TxContext) {
        let checker = init_checker.is_created;
        assert!(checker == true, CONTRACT_HASNT_BEEN_PUBLISHED_OR_WRONG_CHECKER_USED);

        //let tracker = create_coin_tracker<T,SUI>(init_checker, ctx);
        
        let sui_value = sui_coin.value();
        assert!(sui_value > 0, NOT_ENOUGH_SUI_TO_PERFORM_TRANSACTION);
        let name_vector = name.into_bytes();
        let symbol_vector = symbol.into_bytes();
        let description_vector = description.into_bytes();
        let witness = create_witness();
        let (treasury, metadata) = coin::create_currency(
            witness,
            decimals,
            symbol_vector,
            name_vector,
            description_vector,
            icon_url,
            ctx,
        );
        //transfer::public_freeze_object(metadata); // this is going to freeze the token completely, shouldnt be used.
        //let new_coin = mint_coin(&mut treasury, amount_of_tokens, ctx);
        //let balance_a = new_coin.into_balance(); // turnt the lot into a balance.
        transfer::public_transfer(treasury, ctx.sender());
        transfer::public_transfer(metadata, ctx.sender());
        //let sui_coin_amount_split = coin::split(sui_coin, 1, ctx);
        //let balance_b = sui_coin_amount_split.into_balance();
        //let index = tracker.next_index;
        let pool;
        if(coin_b_pair_is_SUI) {
            let coin_b_vector = b"SUI";
            let coin_b_name = ascii::string(coin_b_vector);
            // pool = create_pool(tracker, balance_a, balance_b, name, coin_b_name, ctx);
            // table::add(&mut tracker.coin_LP, index, pool);
            // sui is pair so we need to pass through sui as the pair token.
            // add another function to add liquidity.
        } else {
            // the use of pair coin B is not sui.
        };
        //transfer::public_share_object(tracker);
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
    public fun create_coin_tracker<T: store, SUI: store>(/*coin_a: coin::Coin<T>, coin_SUI: coin::Coin<SUI>,*/ init_checker: &Init_checker, ctx: &mut TxContext){//: Coin_tracker<T, SUI> 
        let checker = &init_checker.is_created;
        assert!(checker == true, CONTRACT_HASNT_BEEN_PUBLISHED_OR_WRONG_CHECKER_USED);
        let coin_tracker = Coin_tracker {
            id: object::new(ctx),
            coin_LP: table::new<u64, LP<T, SUI>>(ctx),
            next_index: 1
        };
        transfer::public_transfer(coin_tracker, ctx.sender());
        //coin_tracker
    }
    fun create_witness():T{
        let witness = T{};
        witness
    }
    #[allow(unused_function)]
    fun mint_coin<T>(cap: &mut TreasuryCap<T>, value: u64, ctx: &mut TxContext): coin::Coin<T> {
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



