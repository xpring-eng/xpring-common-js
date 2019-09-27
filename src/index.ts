import { AccountInfo } from "../generated/account_info_pb";
import { Currency } from "../generated/currency_pb";
import { Fee } from "../generated/fee_pb";
import { FiatAmount } from "../generated/fiat_amount_pb";
import { GetAccountInfoRequest } from "../generated/get_account_info_request_pb";
import { GetFeeRequest } from "../generated/get_fee_request_pb";
import { Payment } from "../generated/payment_pb";
import { SubmitSignedTransactionRequest } from "../generated/submit_signed_transaction_request_pb";
import { SubmitSignedTransactionResponse } from "../generated/submit_signed_transaction_response_pb";
import { XRPAmount } from "../generated/xrp_amount_pb";
import {
  XRPLedgerClient,
  XRPLedgerService
} from "../generated/xrp_ledger_grpc_pb";

import SignedTransaction from "../generated/signed_transaction_pb";
import Signer from "../src/signer";
import Transaction from "../generated/transaction_pb";

import Wallet from "./wallet";
import Utils from "./utils";
import grpc from "grpc";

/**
 * Exported classes.
 */
class XpringCommon {
  public static readonly AccountInfo = AccountInfo;
  public static readonly Currency = Currency;
  public static readonly Fee = Fee;
  public static readonly FiatAmount = FiatAmount;
  public static readonly GetAccountInfoRequest = GetAccountInfoRequest;
  public static readonly GetFeeRequest = GetFeeRequest;
  public static readonly Payment = Payment;
  public static readonly SubmitSignedTransactionRequest = SubmitSignedTransactionRequest;
  public static readonly SubmitSignedTransactionResponse = SubmitSignedTransactionResponse;
  public static readonly XRPAmount = XRPAmount;
  public static readonly XRPLedgerClient = XRPLedgerClient;
  public static readonly XRPLedgerService = XRPLedgerService;
  public static readonly SignedTransaction = SignedTransaction;
  public static readonly Signer = Signer;
  public static readonly Transaction = Transaction;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
  public static readonly grpc = grpc;
}

export default XpringCommon;
