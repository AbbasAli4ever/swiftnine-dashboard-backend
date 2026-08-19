import { ApiProperty } from '@nestjs/swagger';
import {
  BalanceSummaryDto,
  BankAccountRevenueItemDto,
  CurrencyRevenueItemDto,
  TopClientRevenueItemDto,
} from './dashboard-overview-response.dto';

export class ReportsBreakdownResponseDto {
  @ApiProperty({ example: '2026-07-01' })
  dateFrom!: string;

  @ApiProperty({ example: '2026-07-31' })
  dateTo!: string;

  @ApiProperty({
    type: [BankAccountRevenueItemDto],
    description:
      'Revenue per bank account for the requested period only (not all-time — see /overview for that).',
  })
  revenueByBankAccount!: BankAccountRevenueItemDto[];

  @ApiProperty({
    type: [CurrencyRevenueItemDto],
    description: 'Revenue by currency for the requested period only.',
  })
  revenueByCurrency!: CurrencyRevenueItemDto[];

  @ApiProperty({
    type: [TopClientRevenueItemDto],
    description:
      'Top clients by summed transaction revenue for the requested period only. Clients with no sales in the period are omitted (not zero-filled).',
  })
  topClients!: TopClientRevenueItemDto[];

  @ApiProperty({
    type: BalanceSummaryDto,
    description:
      'Current balances (not scoped to dateFrom/dateTo — there is no historical balance snapshot), narrowed to accounts matching bankAccountId/accountType/currency. clientId has no effect here.',
  })
  balances!: BalanceSummaryDto;
}
